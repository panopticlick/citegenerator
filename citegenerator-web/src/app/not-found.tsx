import { Container } from "@/components/layout/Container";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className="py-14">
      <h1 className="text-3xl font-extrabold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you’re looking for doesn’t exist.</p>
      <Link className="mt-6 inline-flex text-blue-700 hover:text-blue-800 font-semibold" href="/">
        Go back home →
      </Link>
    </Container>
  );
}
