import { signIn, getProviders } from "next-auth/react";
import { getSession } from "next-auth/react";

export default function Signin({ providers }) {
  return (
    <div className="absolute inset-0 mx-auto grid max-w-3xl place-items-center">
      <div className="grid place-items-center gap-16">
        <h2 className="text-center text-5xl font-extrabold">✌️ hey world.</h2>
        <ul className="grid gap-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <li>
                <button
                  onClick={() => signIn(provider.id)}
                  className="flex items-center gap-4 rounded border p-2 px-4 shadow hover:bg-slate-100"
                  key={provider.name}
                >
                  <img src={`/${provider.id}.svg`} className="inline w-6" />
                  <div>Sign in with {provider.name} </div>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();

  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      providers,
    },
  };
}
