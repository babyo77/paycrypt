"use client";
import FAQSection from "@/components/faq-section";
import FooterSection from "@/components/footer";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { motion } from "motion/react";
import { FaShieldAlt, FaLock, FaFileContract, FaEye } from "react-icons/fa";

// Updated animation variants with blur
const fadeIn = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7 },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const members = [
  {
    name: "Meyank Singh",
    github: "https://github.com/meyank-ssh",
    twitter: "https://x.com/meyanksingh",
    avatar: "https://avatars.githubusercontent.com/u/111943685?v=4",
  },
  {
    name: "Tanmay Singh",
    github: "https://github.com/babyo77",
    twitter: "https://x.com/tanmay7_",
    avatar:
      "https://i.pinimg.com/736x/90/57/d0/9057d0064f4ec3dac77811a2efe983ef.jpg",
  },
  {
    name: "Siddhi Patil",
    github: "https://github.com/Siddhi-Patil06",
    twitter: "https://x.com/siddhipatill",
    avatar:
      "https://i.pinimg.com/564x/73/c2/7a/73c27acbbfc677405730ceb5fe597cd9.jpg",
  },
];

const features = [
  {
    title: "Payment Links",
    description:
      "Create custom payment links in seconds — no complicated wallet addresses to share. Just a simple URL your customers can click to pay you in crypto, with automatic conversion and notifications.",
    image:
      "https://i.pinimg.com/originals/5a/55/62/5a5562885a6dda32d867667524f6440b.gif",
  },
  {
    title: "Real-Time Payments",
    description:
      "Receive payments instantly from anywhere in the world with zero currency conversion fees. Our global settlement network confirms transactions in seconds, not days, with complete tracking and transparency.",
    image:
      "https://i.pinimg.com/736x/4d/4b/32/4d4b32ba28663f0aaea58034f7ed7557.jpg",
  },
  {
    title: "Secure Blockchain",
    description:
      "Every transaction is secured by military-grade encryption and immutable blockchain technology. Get fraud protection without chargebacks, with full compliance and audit trails for business records.",
    image:
      "https://i.pinimg.com/736x/e5/6f/77/e56f77e7e02cfaf25c39df005ce16482.jpg",
  },
  {
    title: "Developer Friendly",
    description:
      "Integrate crypto payments into your apps or websites with just a few lines of code. Our comprehensive APIs, SDKs, and webhooks work with all major programming languages and platforms, with detailed documentation.",
    image:
      "https://i.pinimg.com/736x/f5/e9/c6/f5e9c6c32d7612d28ddda8a44307b836.jpg",
  },
];

export default function Home() {
  return (
    <div className="mx-auto px-4 font-semibold leading-tight tracking-tight">
      <motion.header
        className="flex sm:flex-row items-center justify-between p-4 gap-4 px-0"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex items-center gap-4">
          <Logo />
          <nav className="flex items-center gap-4 group">
            <Link
              href="#features"
              className="text-black group-hover:text-gray-500 hover:!text-black transition-colors duration-200"
            >
              Features
            </Link>

            <Link
              href="#security"
              className="text-black group-hover:text-gray-500 hover:!text-black transition-colors duration-200"
            >
              Security
            </Link>
            {/* <Link
              href="#faqs"
              className="text-black group-hover:text-gray-500 hover:!text-black transition-colors duration-200"
            >
              FAQs
            </Link> */}
            <Link
              href="#team"
              className="text-black group-hover:text-gray-500 hover:!text-black transition-colors duration-200"
            >
              Team
            </Link>
          </nav>
        </div>
        <nav className="flex items-center gap-2">
          <Link href="https://discord.gg/7A87VRZn6U" target="_blank">
            <Button className="font-semibold max-md:hidden">Talk to us</Button>
          </Link>
          <Link href="/account">
            <Button className="font-semibold">Try V0</Button>
          </Link>
        </nav>
      </motion.header>
      <motion.div
        className="relative border rounded-xl flex items-center gap-4 flex-col justify-center bg-[url('https://i.pinimg.com/originals/f6/f7/df/f6f7df3c009dc34db262b6e23fcb0c41.gif')] text-white bg-cover bg-center min-h-[calc(100vh-100px)] overflow-hidden p-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60"></div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-9xl z-10 text-center"
          variants={fadeInUp}
        >
          Sell more with Crypto
        </motion.h1>

        <motion.p
          className="font-medium max-w-xl break-words text-center z-10 px-4"
          variants={fadeInUp}
        >
          Accept crypto payments globally and expand your business reach. Fast,
          secure, and borderless transactions for modern commerce.
        </motion.p>

        <motion.div
          className="flex sm:flex-row items-center gap-2 z-10"
          variants={fadeInUp}
        >
          <Link href="/x/pay">
            <Button className="font-medium w-full sm:w-auto">View demo</Button>
          </Link>
          <Link href="https://discord.gg/7A87VRZn6U" target="_blank">
            <Button className="font-medium w-full sm:w-auto">
              Join waitlist
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.section
        id="features"
        className="mt-10 md:mt-14 text-start space-y-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl text-blue-700 tracking-tighter sm:text-4xl md:text-5xl">
          FEATURES & BENEFITS
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          Everything you need to accept crypto payments professionally
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8"
          variants={staggerChildren}
        >
          {/* Large featured item - spans 2 columns and 2 rows */}
          <motion.div
            className="border rounded-xl overflow-hidden md:col-span-2 md:row-span-2"
            variants={fadeInUp}
          >
            <div className="h-full flex flex-col">
              <div className="h-80 md:h-96 w-full overflow-hidden">
                <img
                  src={features[0].image}
                  alt={features[0].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold mb-3">{features[0].title}</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {features[0].description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Regular items - with full-width images */}
          <motion.div
            className="border rounded-xl overflow-hidden"
            variants={fadeInUp}
          >
            <div className="md:h-48 aspect-square w-full overflow-hidden">
              <img
                src={features[1].image}
                alt={features[1].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex-1">
              <h3 className="text-xl font-bold mb-2">{features[1].title}</h3>
              <p className="text-sm text-muted-foreground font-medium">
                {features[1].description}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="border rounded-xl overflow-hidden"
            variants={fadeInUp}
          >
            <div className="md:h-48 aspect-square w-full overflow-hidden">
              <img
                src={features[2].image}
                alt={features[2].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex-1">
              <h3 className="text-xl font-bold mb-2">{features[2].title}</h3>
              <p className="text-sm text-muted-foreground font-medium">
                {features[2].description}
              </p>
            </div>
          </motion.div>

          {/* Wide item - spans 2 columns */}
          <motion.div
            className="border rounded-xl overflow-hidden md:col-span-2"
            variants={fadeInUp}
          >
            <div className="h-full flex flex-col md:flex-row">
              <div className="md:h-48 aspect-square md:w-1/3 overflow-hidden">
                <img
                  src={features[3].image}
                  alt={features[3].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-xl font-bold mb-2">{features[3].title}</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {features[3].description}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* <motion.section
        id="dashboard"
        className="mt-10 md:mt-14 text-start space-y-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl text-blue-700 tracking-tighter sm:text-4xl md:text-5xl">
          DASHBOARD / DEMO PREVIEW
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          See how easy it is to manage your crypto payments
        </p>

        <motion.div
          className="border rounded-xl overflow-hidden mt-6"
          variants={fadeInUp}
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src="https://i.pinimg.com/736x/ce/68/60/ce6860e5b54ebcf805fd33d65e807dc8.jpg"
              alt="Dashboard Preview"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-4 flex justify-center">
            <Link href="/sandbox">
              <Button size="lg" className="font-medium">
                Try it in Sandbox
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.section> */}

      <motion.section
        id="security"
        className="mt-10 md:mt-14 text-start space-y-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl text-blue-700 tracking-tighter sm:text-4xl md:text-5xl">
          SECURITY & TRUST
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          Your security is our top priority
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8"
          variants={staggerChildren}
        >
          {/* Regular security items - positioned first */}
          <motion.div
            className="border rounded-xl overflow-hidden"
            variants={fadeInUp}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <FaFileContract className="text-blue-600 text-xl" />
                <h3 className="text-lg font-bold">Smart contract based</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Our payment infrastructure is built on audited, secure smart
                contracts that execute automatically and can't be tampered with.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="border rounded-xl overflow-hidden"
            variants={fadeInUp}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <FaShieldAlt className="text-blue-600 text-xl" />
                <h3 className="text-lg font-bold">KYT / Audit roadmap</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive security audits and Know Your Transaction
                protocols to prevent financial crimes and ensure compliance.
              </p>
            </div>
          </motion.div>

          {/* Large featured security item - now positioned on the right side */}
          <motion.div
            className="border rounded-xl overflow-hidden md:col-span-2 md:row-span-2"
            variants={fadeInUp}
          >
            <div className="h-full p-0 flex flex-col">
              <div className="h-80 md:h-96 w-full overflow-hidden">
                <img
                  src="https://i.pinimg.com/originals/38/a1/47/38a147e19ef6f9629cf749da2df85b45.gif"
                  alt="Multi-signature protection"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <FaShieldAlt className="text-blue-600 text-xl" />
                  <h3 className="text-lg font-bold">
                    Multi-signature protection
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Advanced multi-signature wallet technology requires multiple
                  verifications for transactions, preventing unauthorized access
                  and single points of failure.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Wide security item - spans 2 columns */}
          <motion.div
            className="border rounded-xl overflow-hidden md:col-span-2"
            variants={fadeInUp}
          >
            <div className="p-6 flex h-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <FaEye className="text-blue-600 text-xl" />
                  <h3 className="text-lg font-bold">Privacy & Transparency</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We balance privacy with transparency through detailed
                  documentation, clear policies, and blockchain-based
                  verification that keeps your business data secure while
                  maintaining compliance.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        id="solutions"
        className="mt-10 md:mt-14 text-start space-y-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl text-blue-700 tracking-tighter sm:text-4xl md:text-5xl">
          IDEAL FOR
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          Paycrypt is designed for crypto enthusiasts who want to accept crypto
          payments.
        </p>
        <motion.div
          className="flex flex-col gap-8 py-8"
          variants={staggerChildren}
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerChildren}
          >
            {[
              {
                title: "Creators & Professionals",
                image:
                  "https://i.pinimg.com/736x/96/5a/85/965a85db23198e87638ba8e9f194441d.jpg",
                description:
                  "Artists, content creators, freelancers and consultants accepting global payments without borders.",
              },
              {
                title: "Businesses & Startups",
                image:
                  "https://i.pinimg.com/736x/7a/0c/61/7a0c61cdcb7870c4246180b4831e5abe.jpg",
                description:
                  "E-commerce stores, SaaS products, and online services expanding payment options.",
              },
              {
                title: "Others",
                image:
                  "https://i.pinimg.com/736x/99/2b/da/992bda09902534bf1eb16e98578a083a.jpg",
                description:
                  "Individuals looking to receive crypto payments from friends, family, and customers without complexity.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="border rounded-xl overflow-hidden h-full flex flex-col relative group"
                variants={fadeInUp}
              >
                <div className="h-full w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-square h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/90">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        id="vision"
        className="mt-10 md:mt-14 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 rounded-xl -z-10"></div>

        <div className="p-10 md:p-16 text-white">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6 tracking-tight">
            Our Vision
          </h2>

          <div className="max-w-3xl">
            <p className="text-2xl md:text-3xl mb-6 leading-tight">
              "We're building the Stripe of crypto – without borders."
            </p>

            <p className="text-lg opacity-90 font-medium mb-8">
              In a world where financial systems have boundaries, we're creating
              a payment infrastructure that knows no limits. PayCrypt is
              eliminating the complexity of accepting crypto payments, so
              businesses can focus on what they do best – growing globally.
            </p>

            <Link href="https://discord.gg/7A87VRZn6U" target="_blank">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-base"
              >
                Join the waitlist
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="team"
        className="mt-10 md:mt-14 text-start space-y-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        variants={fadeInUp}
      >
        <h3 className="text-3xl text-blue-700 tracking-tighter sm:text-4xl md:text-5xl">
          Meet the team
        </h3>
        <p className="text-muted-foreground text-sm font-medium">
          PayCrypt is a team of forward-thinking innovators passionate about
          reshaping the future of finance through secure and seamless crypto
          payment solutions.
        </p>
        <motion.div
          className="flex flex-wrap gap-6 py-6"
          variants={staggerChildren}
        >
          {members.map((member, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <div className="bg-background md:size-44 size-40 rounded-sm overflow-hidden">
                <img
                  className="aspect-square object-cover"
                  src={member.avatar}
                  alt={member.name}
                  height="460"
                  width="460"
                  loading="lazy"
                />
              </div>
              <span className="mt-2 block text-sm font-medium">
                {member.name}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <Link href={member.twitter}>
                  <FaXTwitter className="size-3.5 text-muted-foreground/80 hover:text-foreground" />
                </Link>
                <Link href={member.github}>
                  <FaGithub className="size-3.5 text-muted-foreground/80 hover:text-foreground" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        variants={fadeInUp}
      >
        <FAQSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        variants={fadeIn}
      >
        <FooterSection />
      </motion.div>
    </div>
  );
}
