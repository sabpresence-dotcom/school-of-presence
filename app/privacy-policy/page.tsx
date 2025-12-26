export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl sm:text-5xl font-bold font-heading text-white mb-8">Privacy Policy</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-slate-300 mb-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
                        <p className="text-slate-400">
                            Welcome to the Sarpong Andrews Boakye website. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from)
                            and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">2. Data We Collect</h2>
                        <p className="text-slate-400">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        </p>
                        <ul className="list-disc pl-6 text-slate-400 space-y-2">
                            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                            <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">3. How We Use Your Data</h2>
                        <p className="text-slate-400">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 text-slate-400 space-y-2">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
                        <p className="text-slate-400">
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                            In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">5. Contact Us</h2>
                        <p className="text-slate-400">
                            If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:boakyesarpong18@gmail.com" className="text-primary hover:underline">boakyesarpong18@gmail.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
