export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl sm:text-5xl font-bold font-heading text-white mb-8">Terms of Service</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-slate-300 mb-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
                        <p className="text-slate-400">
                            By accessing our website, subscribing to our services, or purchasing our courses, you agree to be bound by these Terms of Service and all terms incorporated by reference.
                            If you do not agree to all of these terms, then you may not access the website or use any services.
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">2. Intellectual Property Rights</h2>
                        <p className="text-slate-400">
                            Unless otherwise indicated, the Site and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”)
                            and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us,
                            and are protected by copyright and trademark laws and various other intellectual property rights.
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">3. User Representations</h2>
                        <p className="text-slate-400">
                            By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete;
                            (2) you will maintain the accuracy of such information and promptly update such registration information as necessary;
                            (3) you have the legal capacity and you agree to comply with these Terms of Service.
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">4. Purchases and Payment</h2>
                        <p className="text-slate-400">
                            We accept the following forms of payment: Visa, Mastercard, Mobile Money. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site.
                            We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">5. Contact Us</h2>
                        <p className="text-slate-400">
                            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:boakyesarpong18@gmail.com" className="text-primary hover:underline">boakyesarpong18@gmail.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
