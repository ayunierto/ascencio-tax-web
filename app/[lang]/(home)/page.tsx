import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>HomePage</h1>

      <p>Welcome to the home page!</p>

      <Link href="/signin">Sign In</Link>
    </div>
  );
}
