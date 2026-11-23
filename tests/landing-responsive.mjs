import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const ORIGIN = process.env.TEST_ORIGIN || 'http://127.0.0.1:3000';
const BASE_URL = process.env.TEST_URL || `${ORIGIN}/?view=landing`;
const APP_URL = `${ORIGIN}/?view=app`;
const VIEWPORTS = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920];
const THEMES = ['dark', 'light'];
const LANGS = ['fr', 'en'];

async function loadChromium() {
  try {
    const mod = await import('playwright');
    return mod.chromium;
  } catch {
    const globalPath = '/usr/local/share/bun-global/node_modules/playwright/index.mjs';
    if (existsSync(globalPath)) {
      const mod = await import(pathToFileURL(globalPath).href);
      return mod.chromium;
    }
    throw new Error('Playwright package could not be resolved locally or globally.');
  }
}

async function launchBrowser() {
  const chromium = await loadChromium();
  const launchOpts = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  const fallbackShell = '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell';
  try {
    return await chromium.launch(launchOpts);
  } catch (err) {
    if (existsSync(fallbackShell)) {
      return await chromium.launch({ ...launchOpts, executablePath: fallbackShell });
    }
    throw err;
  }
}

function rectsOverlap(a, b) {
  return !(
    a.right <= b.left + 0.5 ||
    a.left >= b.right - 0.5 ||
    a.bottom <= b.top + 0.5 ||
    a.top >= b.bottom - 0.5
  );
}

async function setLanguageAndTheme(page, lang, theme) {
  if (!page.url().startsWith(ORIGIN)) {
    await page.goto(BASE_URL, { waitUntil: 'load' });
  }
  await page.evaluate(
    ({ lang, theme }) => {
      localStorage.setItem('certifai_language_preference_v1', lang);
      localStorage.setItem('certifai_theme_v1', theme);
    },
    { lang, theme }
  );
  await page.goto(BASE_URL, { waitUntil: 'load' });
  await page.waitForSelector('header', { state: 'visible', timeout: 15000 });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    return document.fonts?.ready;
  });
}

async function run() {
  const browser = await launchBrowser();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore harmless Vite HMR websocket warnings in restricted preview containers if any
        if (!text.includes('WebSocket')) {
          consoleErrors.push(text);
        }
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });
    page.on('response', (res) => {
      if (res.status() >= 400 && !res.url().includes('favicon')) {
        failedRequests.push(`${res.status()} ${res.url()}`);
      }
    });

    console.log('1. Testing Responsive Matrix (9 viewports x 2 languages x 2 themes = 36 passes)...');

    for (const lang of LANGS) {
      for (const theme of THEMES) {
        await setLanguageAndTheme(page, lang, theme);

        // Confirm theme & lang applied
        const state = await page.evaluate(() => ({
          isDark: document.documentElement.classList.contains('dark'),
          h1: document.querySelector('h1')?.textContent?.trim() || '',
        }));
        assert.equal(state.isDark, theme === 'dark', `Expected dark=${theme === 'dark'}, got ${state.isDark}`);
        if (lang === 'fr') {
          assert.match(state.h1, /Préparez vos certifications Cloud & IA/i);
        } else {
          assert.match(state.h1, /Prepare for Cloud & AI certifications/i);
        }

        for (const width of VIEWPORTS) {
          await page.setViewportSize({ width, height: 900 });
          await page.waitForTimeout(80);

          const metrics = await page.evaluate((vw) => {
            const docEl = document.documentElement;
            const body = document.body;
            const header = document.querySelector('header');
            const headerInner = header?.firstElementChild;
            const logoBtn = header?.querySelector('button');
            const desktopNav = header?.querySelector('nav');
            const navLinks = Array.from(desktopNav?.querySelectorAll('a') || []);
            const rightZone = headerInner?.children[2];
            const desktopControls = rightZone?.children[0];
            const hamburgerBtn = rightZone?.children[1];

            // Find any element protruding past viewport width
            const offenders = [];
            for (const el of document.querySelectorAll('body *')) {
              const style = window.getComputedStyle(el);
              if (style.display === 'none' || style.visibility === 'hidden') continue;
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              if (r.right > vw + 1.5 || r.left < -1.5) {
                offenders.push({
                  tag: el.tagName,
                  cls: String(el.className).slice(0, 80),
                  left: Math.round(r.left),
                  right: Math.round(r.right),
                  vw,
                });
                if (offenders.length >= 5) break;
              }
            }

            const rectObj = (el) => {
              if (!el) return null;
              const r = el.getBoundingClientRect();
              const cs = window.getComputedStyle(el);
              return {
                visible: cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0,
                left: r.left,
                right: r.right,
                top: r.top,
                bottom: r.bottom,
                width: r.width,
                height: r.height,
              };
            };

            const rootDiv = document.getElementById('root')?.firstElementChild;
            const rootOverflowX = rootDiv ? window.getComputedStyle(rootDiv).overflowX : null;

            return {
              innerWidth: window.innerWidth,
              docScrollWidth: docEl.scrollWidth,
              bodyScrollWidth: body.scrollWidth,
              rootOverflowX,
              header: rectObj(header),
              logoBtn: rectObj(logoBtn),
              desktopNav: rectObj(desktopNav),
              navLinks: navLinks.map((a) => ({
                text: a.textContent?.trim(),
                ...rectObj(a),
              })),
              desktopControls: rectObj(desktopControls),
              hamburgerBtn: rectObj(hamburgerBtn),
              offenders,
            };
          }, width);

          assert.notEqual(
            metrics.rootOverflowX,
            'hidden',
            `Landing root must NOT mask overflow with overflow-x-hidden (at ${width}px)`
          );
          assert.ok(
            metrics.docScrollWidth <= metrics.innerWidth,
            `[${lang}/${theme} @ ${width}px] Horizontal overflow detected: docScrollWidth=${metrics.docScrollWidth} > innerWidth=${metrics.innerWidth}. Offenders: ${JSON.stringify(metrics.offenders)}`
          );
          assert.ok(
            metrics.bodyScrollWidth <= metrics.innerWidth,
            `[${lang}/${theme} @ ${width}px] Body overflow detected: bodyScrollWidth=${metrics.bodyScrollWidth} > innerWidth=${metrics.innerWidth}`
          );
          assert.equal(
            metrics.offenders.length,
            0,
            `[${lang}/${theme} @ ${width}px] Elements exceed viewport: ${JSON.stringify(metrics.offenders)}`
          );

          // Header height & viewport fit
          assert.ok(metrics.header && metrics.header.visible, `Header missing at ${width}px`);
          assert.ok(
            metrics.header.height >= 64 && metrics.header.height <= 80,
            `Header height ${metrics.header.height} out of 64-80px range at ${width}px`
          );
          assert.ok(metrics.logoBtn?.visible && metrics.logoBtn.right <= width + 0.5, `Logo clipped at ${width}px`);

          if (width >= 1280) {
            // Desktop: 4 nav links visible, single line, no overlap, hamburger hidden
            assert.ok(metrics.desktopNav?.visible, `Desktop nav must be visible at ${width}px`);
            assert.equal(metrics.navLinks.length, 4, `Expected 4 primary nav links at ${width}px`);
            for (const link of metrics.navLinks) {
              assert.ok(link.visible, `Nav link "${link.text}" not visible at ${width}px`);
              assert.ok(link.height <= 44, `Nav link "${link.text}" wrapped onto multiple lines (${link.height}px) at ${width}px`);
              assert.ok(link.right <= width + 0.5, `Nav link "${link.text}" clipped at ${width}px`);
            }
            assert.ok(metrics.desktopControls?.visible, `Right controls must be visible at ${width}px`);
            assert.ok(metrics.desktopControls.right <= width + 0.5, `Right controls clipped at ${width}px`);
            assert.ok(!metrics.hamburgerBtn?.visible, `Hamburger must be hidden at ${width}px`);
            assert.ok(!rectsOverlap(metrics.logoBtn, metrics.desktopNav), `Logo overlaps nav at ${width}px`);
            assert.ok(!rectsOverlap(metrics.desktopNav, metrics.desktopControls), `Nav overlaps controls at ${width}px`);
          } else if (width >= 768) {
            // Tablet (768-1279): desktop nav hidden, right controls visible, hamburger visible, no overlap
            assert.ok(!metrics.desktopNav?.visible, `Desktop nav must be hidden at ${width}px`);
            assert.ok(metrics.desktopControls?.visible, `Tablet right controls must be visible at ${width}px`);
            assert.ok(metrics.hamburgerBtn?.visible, `Hamburger must be visible at ${width}px`);
            assert.ok(metrics.hamburgerBtn.right <= width + 0.5, `Hamburger clipped at ${width}px`);
            assert.ok(!rectsOverlap(metrics.logoBtn, metrics.desktopControls), `Logo overlaps tablet controls at ${width}px`);
            assert.ok(!rectsOverlap(metrics.desktopControls, metrics.hamburgerBtn), `Controls overlap hamburger at ${width}px`);
          } else {
            // Mobile (< 768): desktop nav & tablet controls hidden, hamburger visible (>=44px)
            assert.ok(!metrics.desktopNav?.visible, `Desktop nav must be hidden at ${width}px`);
            assert.ok(!metrics.desktopControls?.visible, `Desktop controls must be hidden at ${width}px`);
            assert.ok(metrics.hamburgerBtn?.visible, `Hamburger must be visible at ${width}px`);
            assert.ok(metrics.hamburgerBtn.width >= 44 && metrics.hamburgerBtn.height >= 44, `Hamburger < 44px at ${width}px`);
            assert.ok(metrics.hamburgerBtn.right <= width + 0.5, `Hamburger clipped at ${width}px`);
            assert.ok(!rectsOverlap(metrics.logoBtn, metrics.hamburgerBtn), `Logo overlaps hamburger at ${width}px`);
          }
        }
      }
    }
    console.log('✅ Passed all 36 responsive viewport/language/theme passes with 0px overflow!');

    console.log('2. Testing Mobile & Tablet Drawer Accessibility, Scroll Lock, Escape & Navigation...');
    for (const width of [390, 768]) {
      await setLanguageAndTheme(page, 'fr', 'dark');
      await page.setViewportSize({ width, height: 844 });
      const hamburger = page.locator('header button[aria-controls="landing-mobile-drawer"]');
      await hamburger.click();

      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });

      // Body scroll lock & close button focused
      const drawerChecks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('#landing-mobile-drawer nav a'));
        const closeBtn = document.querySelector('#landing-mobile-drawer button[aria-label]');
        return {
          bodyOverflow: document.body.style.overflow,
          activeTag: document.activeElement?.tagName,
          activeIsCloseBtn: document.activeElement === closeBtn,
          linkHeights: links.map((a) => a.getBoundingClientRect().height),
          linkCount: links.length,
        };
      });
      assert.equal(drawerChecks.bodyOverflow, 'hidden', `Body scroll lock not active at ${width}px`);
      assert.equal(drawerChecks.activeIsCloseBtn, true, `Focus did not move to drawer close button at ${width}px`);
      assert.equal(drawerChecks.linkCount, 4, 'Drawer should contain 4 primary links');
      for (const h of drawerChecks.linkHeights) {
        assert.ok(h >= 48, `Mobile drawer link height ${h}px < 48px tactile minimum`);
      }

      // Escape closes drawer and restores focus to hamburger
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      const afterEscape = await page.evaluate(() => ({
        bodyOverflow: document.body.style.overflow,
        focusOnHamburger:
          document.activeElement?.getAttribute('aria-controls') === 'landing-mobile-drawer',
      }));
      assert.notEqual(afterEscape.bodyOverflow, 'hidden', 'Body scroll lock not released after Escape');
      assert.equal(afterEscape.focusOnHamburger, true, 'Focus not restored to hamburger button after Escape');

      // Open drawer and click a nav link -> auto-closes drawer
      await hamburger.click();
      await dialog.waitFor({ state: 'visible' });
      await page.locator('#landing-mobile-drawer nav a[href="#certifications"]').click();
      await dialog.waitFor({ state: 'hidden' });
    }
    console.log('✅ Passed mobile/tablet drawer accessibility & keyboard tests!');

    console.log('3. Testing Header Language Switch, Theme Toggle, Interactive Features, Images & App Navigation...');
    await page.setViewportSize({ width: 1280, height: 900 });
    await setLanguageAndTheme(page, 'fr', 'dark');

    // Test Theme Toggle in Header
    const headerThemeBtn = page.locator('header button[aria-label*="thème"], header button[aria-label*="theme"]').first();
    await headerThemeBtn.click();
    assert.equal(
      await page.evaluate(() => document.documentElement.classList.contains('dark')),
      false,
      'Clicking theme toggle did not switch to light mode'
    );
    await headerThemeBtn.click();
    assert.equal(
      await page.evaluate(() => document.documentElement.classList.contains('dark')),
      true,
      'Clicking theme toggle second time did not switch back to dark mode'
    );

    // Test Language Switch FR -> EN in Header
    const enBtn = page.locator('header button', { hasText: 'EN' }).first();
    await enBtn.click();
    await page.waitForTimeout(100);
    const enHeader = await page.locator('header nav').textContent();
    assert.match(enHeader || '', /Features.*Certifications.*Method.*FAQ/);

    // Switch back to FR
    const frBtn = page.locator('header button', { hasText: 'FR' }).first();
    await frBtn.click();
    await page.waitForTimeout(100);
    const frHeader = await page.locator('header nav').textContent();
    assert.match(frHeader || '', /Fonctionnalités.*Certifications.*Méthode.*FAQ/);

    // Test Interactive Simulator: SM-2 Flashcard + Scenario MCQ
    const simSection = page.locator('#simulateur');
    await simSection.scrollIntoViewIfNeeded();
    await simSection.locator('button', { hasText: 'Semantic Ranker' }).click();
    const sm2Btn = simSection.locator('button', { hasText: /Bien|Good/ });
    await sm2Btn.waitFor({ state: 'visible' });
    await sm2Btn.click();
    await simSection.locator('button', { hasText: /QCM Scénarisé|Scenario MCQ/ }).click();
    await simSection.locator('[role="radiogroup"] button').nth(1).click();
    await simSection.locator('button', { hasText: /Valider la réponse|Submit Answer/ }).click();

    // Test Screenshots Gallery tab switching & Verify All Images Load cleanly
    const capturesSection = page.locator('#captures');
    await capturesSection.scrollIntoViewIfNeeded();
    await capturesSection.locator('button', { hasText: /04\. Catalogue/ }).click();
    await capturesSection.locator('button', { hasText: /01\. Cockpit/ }).click();

    // Test Socratic AI Tutor interactive dialogue
    const tutorSection = page.locator('#tuteur-ia');
    await tutorSection.scrollIntoViewIfNeeded();
    const tutorBtn = tutorSection.locator('button').filter({ hasText: /Étape suivante|Next step|Rejouer|Replay/ }).first();
    if (await tutorBtn.count()) {
      await tutorBtn.click();
    }

    // Scroll all images into view (for loading="lazy") and verify none are broken
    const imgCount = await page.locator('img').count();
    for (let i = 0; i < imgCount; i++) {
      const img = page.locator('img').nth(i);
      await img.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
    }
    const brokenImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.getAttribute('src'));
    });
    assert.equal(brokenImages.length, 0, `Broken images found: ${JSON.stringify(brokenImages)}`);

    // Test Provider Filter in Certifications section
    const certsSection = page.locator('#certifications');
    await certsSection.scrollIntoViewIfNeeded();
    const awsFilterBtn = certsSection.locator('button', { hasText: 'AWS' }).first();
    await awsFilterBtn.click();
    const awsCount = await certsSection.locator('button[aria-pressed="true"]').count();
    assert.ok(awsCount >= 1);

    // Test FAQ Accordion
    const faqSection = page.locator('#faq');
    await faqSection.scrollIntoViewIfNeeded();
    const secondFaqBtn = faqSection.locator('button[aria-expanded]').nth(1);
    await secondFaqBtn.click();
    assert.equal(await secondFaqBtn.getAttribute('aria-expanded'), 'true');

    // Test Primary CTA navigates to App Today Screen
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('header button', { hasText: 'Accéder à CertifIA' }).click();
    await page.waitForTimeout(250);
    const appLoaded = await page.evaluate(() => !document.querySelector('a[href="#piliers"]'));
    assert.equal(appLoaded, true, 'Primary CTA did not navigate away from landing page into the app');

    console.log('4. Testing App Clean Zero-State, Persistence Across Reload, Goal Update, Reset & Modal Accessibility...');
    // Clear storage to guarantee brand-new user state and reload App
    await page.evaluate(() => localStorage.clear());
    await page.goto(APP_URL, { waitUntil: 'load' });
    await page.evaluate(() => {
      localStorage.setItem('certifai_language_preference_v1', 'fr');
      localStorage.setItem('certifai_theme_v1', 'dark');
    });
    await page.reload({ waitUntil: 'load' });

    // Accept mandatory legal onboarding modal
    const legalDialog = page.locator('[role="dialog"][aria-modal="true"]');
    await legalDialog.waitFor({ state: 'visible', timeout: 10000 });
    await legalDialog.locator('input[type="checkbox"]').first().check();
    await legalDialog.locator('button', { hasText: /Accéder|Enter Application|Valider/i }).last().click();
    await legalDialog.waitFor({ state: 'hidden' });

    // Verify clean zero-state metrics on TodayView
    await page.waitForSelector('#today-main-container', { state: 'visible' });
    const cleanText = await page.locator('#today-main-container').innerText();
    assert.match(cleanText, /0 jours consécutifs/);
    assert.match(cleanText, /0\s*%/);
    assert.match(cleanText, /0\s*\/\s*400\s+fiches révisées/i);
    assert.match(cleanText, /Aucune activité enregistrée/i);
    assert.equal(await page.locator('aside').innerText().then((t) => t.includes('SRS 0')), true, 'Sidebar should start at SRS 0');

    // Rate a flashcard in FlashcardsView -> verify persistence across reload
    await page.locator('aside button', { hasText: /Fiches mémo|Flashcards/i }).first().click();
    const browseAllBtn = page.locator('button', { hasText: /Parcourir les \d+ fiches|Browse all \d+ cards/i });
    await browseAllBtn.waitFor({ state: 'visible', timeout: 10000 });
    await browseAllBtn.click();
    await page.waitForSelector('[data-tour="flashcards-engine"]', { state: 'visible', timeout: 10000 });
    await page.keyboard.press('Space');
    await page.locator('button', { hasText: /Facile \[4\]|Easy \[4\]/i }).click();
    await page.waitForTimeout(200);

    // Answer a quiz question in QuizView -> verify persistence across reload
    await page.locator('aside button', { hasText: /Quiz & QCM|Quizzes & MCQs/i }).first().click();
    await page.waitForSelector('[data-tour="quiz-container"]', { state: 'visible', timeout: 10000 });
    await page.locator('[data-tour="quiz-container"] button').first().click();
    await page.locator('[data-tour="quiz-container"] button', { hasText: /Valider la réponse|Submit Answer/i }).click();
    await page.waitForTimeout(200);

    // Update target certification in ProfileView -> verify persistence across reload
    await page.locator('aside button', { hasText: /Mode invité|Guest mode|Apprenant IA/i }).click();
    await page.waitForSelector('#profile-cert-option-gcpmle', { state: 'visible', timeout: 10000 });
    await page.locator('#profile-cert-option-gcpmle').click();
    await page.waitForTimeout(200);

    // Reload page and confirm persistence of target cert, flashcard review, and quiz attempt
    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector('#today-main-container', { state: 'visible', timeout: 10000 });
    const afterReloadText = await page.locator('#today-main-container').innerText();
    assert.match(afterReloadText, /GCP-PMLE/, 'Target certification selection did not persist after reload');
    assert.match(afterReloadText, /1 jours consécutifs/, 'Streak did not update to 1 day and persist after reload');
    assert.doesNotMatch(afterReloadText, /Aucune activité enregistrée/i, 'Recent activity did not persist after reload');

    // Verify Command Palette modal accessibility & Escape close
    await page.keyboard.press('Control+k');
    const cmdDialog = page.locator('[role="dialog"][aria-modal="true"]');
    await cmdDialog.waitFor({ state: 'visible', timeout: 10000 });
    await page.keyboard.press('Escape');
    await cmdDialog.waitFor({ state: 'hidden', timeout: 10000 });

    // Trigger global Reset Data modal from Header Account Menu & confirm complete return to 0 across reload
    await page.locator('#header-user-menu-btn').click();
    await page.locator('#header-menu-reset-data-btn').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('#header-menu-reset-data-btn').click();
    await page.locator('#reset-data-modal').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('#reset-modal-confirm-btn').click();
    await page.locator('#reset-modal-success-banner').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('#reset-modal-done-btn').click();
    await page.locator('#reset-data-modal').waitFor({ state: 'hidden', timeout: 10000 });

    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector('#today-main-container', { state: 'visible', timeout: 10000 });
    const resetText = await page.locator('#today-main-container').innerText();
    assert.match(resetText, /C1000-177/, 'Active certification did not reset to default C1000-177');
    assert.match(resetText, /0 jours consécutifs/, 'Streak did not reset to 0');
    assert.match(resetText, /0\s*%/, 'Progress percentage did not reset to 0%');
    assert.match(resetText, /0\s*\/\s*400\s+fiches révisées/i, 'Reviewed cards counter did not reset to 0 / 400');
    assert.match(resetText, /Aucune activité enregistrée/i, 'Recent activity did not reset');
    assert.equal(await page.locator('aside').innerText().then((t) => t.includes('SRS 0')), true, 'Sidebar did not reset to SRS 0');

    // 5. Verify Backend Audit API Security Guards & Unauthenticated Admin Gate
    console.log('5. Testing /api/audit/* security guards and unauthenticated /?view=audit gate...');
    const healthRes = await fetch(`${ORIGIN}/api/audit/health`);
    assert.equal(healthRes.status, 200, 'Expected /api/audit/health to return 200 JSON');
    const healthJson = await healthRes.json();
    assert.equal(healthJson.ok, true);
    assert.equal(healthJson.model, 'gemini-4-hydrogen');

    const unauthAnalyzeRes = await fetch(`${ORIGIN}/api/audit/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId: 'test', contentType: 'quiz_question', contentVersion: 1 }),
    });
    assert.equal(unauthAnalyzeRes.status, 401, 'Unauthenticated /api/audit/analyze must return 401');

    const unauthCheckSrcRes = await fetch(`${ORIGIN}/api/audit/check-source`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://learn.microsoft.com/' }),
    });
    assert.equal(unauthCheckSrcRes.status, 401, 'Unauthenticated /api/audit/check-source must return 401');

    const badTokenRes = await fetch(`${ORIGIN}/api/audit/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid.jwt.token',
      },
      body: JSON.stringify({ contentId: 'test' }),
    });
    assert.equal(badTokenRes.status, 401, 'Forged Bearer token on /api/audit/analyze must return 401');

    // Verify unauthenticated browser access to /?view=audit displays strict sign-in gate with ZERO admin data leaked
    await page.goto(`${ORIGIN}/?view=audit`, { waitUntil: 'load' });
    await page.waitForSelector('#audit-admin-gate-signin', { state: 'visible', timeout: 10000 });
    const adminWorkspaceLeaked = await page.locator('#audit-workspace-root').count();
    assert.equal(adminWorkspaceLeaked, 0, 'Admin workspace must NEVER render for unauthenticated visitors');
    const adminSidebarLeak = await page.locator('#sidebar-audit-admin-btn').count();
    assert.equal(adminSidebarLeak, 0, 'Sidebar must hide admin Audit entry from unauthenticated visitors');

    assert.equal(consoleErrors.length, 0, `Console errors detected: ${JSON.stringify(consoleErrors)}`);
    assert.equal(pageErrors.length, 0, `Uncaught page errors detected: ${JSON.stringify(pageErrors)}`);
    assert.equal(failedRequests.length, 0, `Failed HTTP requests detected: ${JSON.stringify(failedRequests)}`);

    console.log('✅ All landing, app persistence, zero-state, reset, security gate, and modal checks passed!');
  } catch (err) {
    try {
      const diag = await page.evaluate(() => {
        const h = document.querySelector('header');
        const cs = h ? getComputedStyle(h) : null;
        return {
          url: window.location.href,
          scrollY: window.scrollY,
          rootLen: document.getElementById('root')?.innerHTML.length || 0,
          headerCount: document.querySelectorAll('header').length,
          headerRect: h ? h.getBoundingClientRect() : null,
          headerStyle: cs ? { display: cs.display, visibility: cs.visibility, opacity: cs.opacity, position: cs.position } : null,
        };
      });
      console.error('Diagnostics:', diag, { consoleErrors, pageErrors, failedRequests });
    } catch {}
    throw err;
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ Playwright verification failed:', err);
  process.exit(1);
});
