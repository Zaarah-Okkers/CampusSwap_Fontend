<template>
  <main class="legal-page">
    <article class="legal-shell">
      <router-link class="back-link" to="/login">← Back to sign in</router-link>
      <p class="eyebrow">CampusSwap legal</p>
      <h1>Privacy Policy</h1>
      <p class="updated">Effective 18 September 2026</p>
      <p class="intro">This policy explains what personal information CampusSwap uses, why we use it, and the choices available to you. We process personal information in accordance with applicable South African law, including POPIA.</p>

      <section><h2>1. Information we collect</h2><p>We collect information you provide when you register or use CampusSwap: your name, email address, selected role, institution or organisation, profile details, messages, listings, service requests, support requests, and safety reports. We also collect limited technical and usage information needed to operate and protect the service, such as browser, log, and session information.</p></section>
      <section><h2>2. How we use information</h2><p>We use information to create and manage accounts, display content you choose to share, enable communication and transactions, provide support, prevent fraud and abuse, maintain security, comply with legal obligations, and improve the service. We send marketing communications only where permitted by law; you can opt out at any time.</p></section>
      <section><h2>3. When we share information</h2><p>We share information with other users where a feature requires it, such as your listing, profile, or message. We may use service providers for hosting, communications, payments, analytics, and support; they may process information only on our instructions and for the stated purpose. We may disclose information where required by law, to protect safety, or in connection with a business transfer.</p></section>
      <section><h2>4. Retention and security</h2><p>We retain information only for as long as needed for the purposes in this policy, to resolve disputes, maintain records, or meet legal obligations. We use reasonable technical and organisational safeguards, but no internet service can guarantee absolute security. Keep your password private and notify us promptly if you believe your account has been compromised.</p></section>
      <section><h2>5. Your rights and choices</h2><p>Subject to applicable law, you may request access to, correction of, deletion of, or information about the processing of your personal information; object to certain processing; or withdraw consent where processing relies on consent. To make a request, email <a href="mailto:privacy@campusswap.co.za">privacy@campusswap.co.za</a>. You may also complain to South Africa’s Information Regulator if you believe your information has been handled unlawfully.</p></section>
      <section><h2>6. Children and international transfers</h2><p>CampusSwap is not intended for children who cannot lawfully consent to these Terms. If we learn that we collected information contrary to applicable law, we will take appropriate steps to delete it. If information is processed outside South Africa, we will use safeguards required by applicable law.</p></section>
      <section><h2>7. Changes and contact</h2><p>We may update this policy to reflect changes in our practices or legal requirements. We will post the updated policy and effective date here. For privacy questions or requests, contact <a href="mailto:privacy@campusswap.co.za">privacy@campusswap.co.za</a>.</p></section>
    </article>
  </main>
</template>

<style scoped>
.legal-page { background: var(--ink); min-height: 100vh; padding: 48px 24px 120px; }.legal-shell { margin: 0 auto; max-width: 820px; }.back-link { color: var(--gold); display: inline-block; font-size: .9rem; font-weight: 700; margin-bottom: 36px; }.eyebrow { color: var(--gold); font-size: .75rem; font-weight: 800; letter-spacing: .12em; margin: 0 0 8px; text-transform: uppercase; }h1 { color: var(--text); font-size: clamp(2.2rem, 5vw, 3.5rem); margin: 0; }.updated { color: var(--text-faint); font-size: .85rem; margin: 10px 0 24px; }.intro { border-left: 3px solid var(--gold); color: var(--text); font-size: 1.06rem; line-height: 1.7; margin: 0 0 34px; padding-left: 18px; }section { border-top: 1px solid var(--glass-border); padding: 24px 0; }h2 { color: var(--text); font-size: 1.25rem; margin: 0 0 8px; }section p { color: var(--text-muted); line-height: 1.7; margin: 0; }a { color: var(--gold); }@media (max-width: 640px) { .legal-page { padding: 28px 16px 100px; }.back-link { margin-bottom: 26px; } }
</style>
