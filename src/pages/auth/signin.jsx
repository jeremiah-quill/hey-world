import { signIn, getProviders } from "next-auth/react";
import { getSession } from "next-auth/react";

const Signin = ({ providers }) => {
  return (
    <div className="absolute inset-0 grid place-items-center max-w-3xl mx-auto">
      <div className="grid place-items-center gap-16">
        <h2 className="text-center text-5xl font-extrabold">Build.</h2>
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              onClick={() => signIn(provider.id)}
              className="flex items-center gap-4 shadow p-2 px-4 rounded border "
              key={provider.name}>
              <img src="/github.svg" className="w-6 inline" />
              <div>Sign in with {provider.name} </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Signin;

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
