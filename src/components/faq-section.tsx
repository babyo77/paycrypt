"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Paycrypt?",
    answer:
      "Paycrypt is a global crypto payment gateway designed for businesses in emerging markets and crypto-native industries. We provide plug-and-play infrastructure that enables entrepreneurs, freelancers, and micro-merchants to accept crypto payments with no-code solutions, no-KYC up to $1,000/day, and full support for multiple stablecoins and blockchain networks.",
  },
  {
    question: "Which cryptocurrencies do you support?",
    answer:
      "We support multiple stablecoins (USDT, USDC) and networks including Ethereum, Tron, Solana, Polygon, and Arbitrum. This multi-chain approach ensures flexibility and efficiency, especially for users in emerging markets.",
  },
  {
    question: "Do I need to complete KYC to use Paycrypt?",
    answer:
      "Unlike most crypto payment gateways, we don't require full KYC for transactions up to $1,000/day. This provides low-friction access for merchants and users, particularly beneficial in emerging markets where KYC can be a significant barrier.",
  },
  {
    question: "What features do you offer merchants?",
    answer:
      "We provide a complete merchant infrastructure including: no-code checkout, smart payment links (one-use, expiring, token-gated), a comprehensive dashboard with analytics, transaction history, refund capabilities, payment reconciliation, and automatic payouts every 3 days directly to your wallet.",
  },
  {
    question: "How do your smart payment links work?",
    answer:
      "Our smart payment links can be customized based on your business needs. They can expire after a set time, be valid for only one use, or be token-gated. This allows you to create dynamic offers without any coding required.",
  },
  {
    question: "What are your transaction fees?",
    answer:
      "We charge 0.5%-1% per transaction, which is the industry standard. We also offer a Premium SaaS Tier with advanced analytics, API features, and custom payment logic for businesses that need more sophisticated solutions.",
  },
  {
    question: "How do I integrate Paycrypt?",
    answer:
      "Integration is simple and requires zero technical knowledge. You can start accepting crypto payments immediately using our no-code checkout links. For businesses needing deeper integration, we also offer API-based solutions that allow seamless scaling from micro-merchants to large crypto-first startups.",
  },
  {
    question: "What upcoming features are you developing?",
    answer:
      "In the next 12 months, we're developing fiat off-ramp solutions for seamless crypto-to-fiat conversion, merchant debit cards to use crypto like fiat, API-native checkout widgets for deeper merchant integration, and on-chain credit scoring for crypto-native businesses.",
  },
];

export default function FAQSection() {
  return (
    <section id="faqs" className="mt-12 px-4">
      <div className="mx-auto max-w-5xl w-full text-start space-y-1">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-blue-500 lg:text-5xl font-medium mb-2 sm:mb-4">
            FAQs
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2 sm:px-0">
            We've answered some of the most common questions below.
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className=" max-w-5xl mx-auto py-6">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-muted"
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="text-base font-medium">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-normal text-[15px]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
