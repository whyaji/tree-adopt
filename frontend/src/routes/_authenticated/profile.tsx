import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getCurrentUser } from '@/lib/api/authApi';

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-books'],
    queryFn: () => getCurrentUser(),
  });

  if (error) return <div>Error: {error.message}</div>;

  const user = data?.data;

  const dataShowd = [
    { key: 'Name', value: user?.name },
    { key: 'Email', value: user?.email },
  ];

  return (
    <div className="flex flex-col gap-2 max-w-xl m-auto mt-6">
      <h2 className="text-2xl font-bold">Profile</h2>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {dataShowd.map((item) => (
            <div key={item.key} className="flex flex-col gap-2">
              <Label className="text-l">{item.key}</Label>
              <Label className="text-xl">{item.value}</Label>
            </div>
          ))}
        </div>
      )}
      <Button
        className="mt-8"
        onClick={() => {
          Cookies.remove('auth_token');
          window.location.href = '/login';
        }}>
        Logout
      </Button>
    </div>
  );
}
