// Imports
import { useRouter } from 'next/router';

export default function TokenPage() {
  // Get token for the password reset
  const router = useRouter();
  const { token } = router.query;

  // Render logic...
  return (
    <div>
      <h1>Your Token: {token}</h1>
    </div>  
  );
}
