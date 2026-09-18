<template>
  <main class="legal-page">
    <article class="legal-shell">
      <router-link class="back-link" to="/login">← Back to sign in</router-link>
      <p class="eyebrow">CampusSwap legal</p>
      <h1>Terms of Service</h1>
      <p class="updated">Effective 18 September 2026</p>
      <p class="intro">These Terms govern the use of CampusSwap, including its marketplace, service-provider, residence, messaging, and safety features. By creating an account or using CampusSwap, you agree to them.</p>

      <section><h2>1. Eligibility and accounts</h2><p>Provide accurate account information, keep your password confidential, and use CampusSwap only for lawful purposes. Select the role and institution or organisation that accurately describes you. Do not impersonate another person, create an account for someone else, or bypass an account restriction.</p></section>
      <section><h2>2. Listings, services, and messages</h2><p>You are responsible for content you post, the accuracy of your listings or service descriptions, and any agreement you make with another user. Do not post stolen, unsafe, unlawful, discriminatory, fraudulent, or misleading content. Do not harass, threaten, spam, or use CampusSwap to solicit users outside the platform’s purpose.</p></section>
      <section><h2>3. Transactions and safety</h2><p>CampusSwap helps users discover and communicate about offers. It is not the seller, buyer, landlord, service provider, or a party to a transaction unless a separate written agreement says otherwise. Inspect an item or service before committing, meet in a safe public place where practical, and never share your password or send money because of a suspicious request. Report unsafe conduct through the platform or to the relevant emergency service.</p></section>
      <section><h2>4. Fees and third parties</h2><p>Any fee, payment method, cancellation rule, or third-party provider will be shown before you confirm the relevant transaction. Third parties have their own terms and privacy practices. CampusSwap is not responsible for their availability or for agreements made directly between users, except where applicable law says otherwise.</p></section>
      <section><h2>5. Your content</h2><p>You keep ownership of content you submit. You grant CampusSwap a non-exclusive, worldwide, royalty-free licence to host, reproduce, display, and adapt that content only as needed to operate, secure, improve, and promote the service. Do not upload content you do not have the right to use.</p></section>
      <section><h2>6. Moderation and suspension</h2><p>We may remove content, limit features, suspend, or close an account where we reasonably believe these Terms, the law, or community safety require it. Where practical, we will explain the action and offer a way to request a review. You may stop using CampusSwap at any time; contact us for account-deletion help.</p></section>
      <section><h2>7. Disclaimers and liability</h2><p>CampusSwap is provided on an “as available” basis. We do not guarantee that listings, users, services, or messages are accurate, safe, or available at all times. To the maximum extent permitted by law, CampusSwap is not liable for indirect or consequential loss from user-to-user interactions. Nothing in these Terms excludes rights or liability that cannot lawfully be excluded.</p></section>
      <section><h2>8. Changes and contact</h2><p>We may update these Terms when the service or law changes. Material changes will be posted here with a revised effective date. Questions or notices can be sent to <a href="mailto:hello@campusswap.co.za">hello@campusswap.co.za</a>.</p></section>
    </article>
  </main>
</template>

<style scoped>
.legal-page { background: var(--ink); min-height: 100vh; padding: 48px 24px 120px; }.legal-shell { margin: 0 auto; max-width: 820px; }.back-link { color: var(--gold); display: inline-block; font-size: .9rem; font-weight: 700; margin-bottom: 36px; }.eyebrow { color: var(--gold); font-size: .75rem; font-weight: 800; letter-spacing: .12em; margin: 0 0 8px; text-transform: uppercase; }h1 { color: var(--text); font-size: clamp(2.2rem, 5vw, 3.5rem); margin: 0; }.updated { color: var(--text-faint); font-size: .85rem; margin: 10px 0 24px; }.intro { border-left: 3px solid var(--gold); color: var(--text); font-size: 1.06rem; line-height: 1.7; margin: 0 0 34px; padding-left: 18px; }section { border-top: 1px solid var(--glass-border); padding: 24px 0; }h2 { color: var(--text); font-size: 1.25rem; margin: 0 0 8px; }section p { color: var(--text-muted); line-height: 1.7; margin: 0; }a { color: var(--gold); }@media (max-width: 640px) { .legal-page { padding: 28px 16px 100px; }.back-link { margin-bottom: 26px; } }
</style>
