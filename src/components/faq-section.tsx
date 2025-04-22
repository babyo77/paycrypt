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
      "Paycrypt is a global crypto payment platform that enables businesses to accept cryptocurrency payments with instant settlements, zero technical complexity, and worldwide accessibility.",
  },
  {
    question: "Which cryptocurrencies do you support?",
    answer:
      "We currently support Ethereum (ETH) and Solana (SOL), with plans to add more cryptocurrencies based on market demand and security considerations.",
  },
  {
    question: "How fast are the settlements?",
    answer:
      "Settlements are instant and occur as soon as the blockchain transaction is confirmed. For Ethereum, this typically takes 15-30 seconds, and for Solana, it's even faster at 400ms.",
  },
  {
    question: "What are the transaction fees?",
    answer:
      "We maintain competitive and transparent pricing with minimal transaction fees. The exact fee structure depends on your business volume and specific requirements. Contact us for detailed pricing information.",
  },
  {
    question: "Is Paycrypt secure?",
    answer:
      "Yes, security is our top priority. We employ industry-leading security measures including multi-signature wallets, cold storage, and real-time fraud detection to ensure your transactions are safe and secure.",
  },
  {
    question: "How do I integrate Paycrypt?",
    answer:
      "Integration is simple and requires minimal technical knowledge. We provide comprehensive documentation, SDKs, and APIs. Join our waitlist to get early access and integration support.",
  },
];

export default function FAQSection() {
  return (
    <section id="faqs" className="mt-12">
      <div className="mx-auto w-full text-start space-y-1">
        <h4 className="text-3xl text-blue-700 tracking-tighter sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h4>
        <p className="text-muted-foreground  text-sm font-medium">
          We've answered some of the most common questions below.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full py-6">
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
