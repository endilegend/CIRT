"use client";

import { MainLayout } from "@/components/layout/MainLayout";

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="ut-container max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600">
                  By accessing and using the CIRT Database, you agree to be
                  bound by these Terms of Service and all applicable laws and
                  regulations. If you do not agree with any of these terms, you
                  are prohibited from using or accessing this site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
                <p className="text-gray-600">
                  Permission is granted to temporarily access and use the CIRT
                  Database for personal, non-commercial research purposes only.
                  This is the grant of a license, not a transfer of title, and
                  under this license you may not:
                </p>
                <ul className="list-disc ml-6 mt-2 text-gray-600">
                  <li>
                    modify or copy the materials without explicit permission
                  </li>
                  <li>use the materials for any commercial purpose</li>
                  <li>
                    attempt to decompile or reverse engineer any software
                    contained in the CIRT Database
                  </li>
                  <li>
                    remove any copyright or other proprietary notations from the
                    materials
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Account</h2>
                <p className="text-gray-600">
                  To access certain features of the CIRT Database, you must
                  create an account. You are responsible for maintaining the
                  confidentiality of your account and password. You agree to
                  accept responsibility for all activities that occur under your
                  account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Content Usage</h2>
                <p className="text-gray-600">
                  All articles, papers, and research materials available through
                  the CIRT Database are protected by copyright and other
                  intellectual property laws. Users must properly cite and
                  attribute any materials used in their research.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Privacy</h2>
                <p className="text-gray-600">
                  Your use of the CIRT Database is also governed by our Privacy
                  Policy. Please review our Privacy Policy to understand our
                  practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Modifications</h2>
                <p className="text-gray-600">
                  The University of Tampa reserves the right to revise these
                  terms of service at any time without notice. By using this
                  website, you are agreeing to be bound by the then current
                  version of these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please
                  contact us at cirt@ut.edu.
                </p>
              </section>

              <div className="mt-8 pt-6 border-t text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
