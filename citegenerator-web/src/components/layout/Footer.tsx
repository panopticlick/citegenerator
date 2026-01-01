import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-sm text-slate-600">
            <div className="font-semibold text-slate-900">CiteGenerator</div>
            <div className="mt-1">Free citation generator for students and researchers.</div>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link className="text-slate-700 hover:text-slate-900" href="/about">
              About
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" href="/faq">
              FAQ
            </Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-slate-500">
          Citations may require manual review. Always follow your instructor’s guidelines.
        </p>
      </Container>
    </footer>
  );
}
