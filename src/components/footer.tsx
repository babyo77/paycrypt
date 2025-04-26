import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-0">
        {/* Main Footer Navigation */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {/* Features Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Features</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Payment Links
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Recurring Billing
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Use-cases Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Use-cases</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  E-Commerce
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Donation
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Ticketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Developers</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://docs.paycrypt.tech"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.paycrypt.tech/api"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/resources/tutorials"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Company Info and Made with love */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Paycrypt
          </p>
        </div>

        {/* Legal Text */}
        <div className="mt-8">
          <p className="text-xs text-muted-foreground">
            Paycrypt is a financial technology company, not a bank or a money
            services business. Certain services are provided by our licensed
            partners across the globe. By creating your account on Paycrypt, you
            agree to our terms and conditions, our partners' terms, to all
            applicable laws and regulations, and agree that you are responsible
            for compliance with any and all applicable local laws.
          </p>
        </div>
      </div>
    </footer>
  );
}
