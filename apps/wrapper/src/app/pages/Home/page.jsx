import React from "react";
import CommonLayout from "../../components/CommonLayout";
import ROUTE_MAP from "../../services/routing/routeMap";
import Linker from "src/app/components/Link";

const Home = () => {
  return (
    <CommonLayout backDisabled={true} logoutDisabled>
      <div className="flex flex-col px-5 py-8 items-center ">
        <img
          src="/assets/homeVector.png"
          className="h-60 lg:h-80 my-5 lg:mt-[70px]"
          alt="illustration"
        />
        <Linker
          text="Login"
          styles="w-80 lg:w-[70%] lg:mt-[70px] animate__animated animate__fadeInDown"
          link={ROUTE_MAP.login} disabled={false}
        />
        <Linker
          text="Register"
          styles="w-80 lg:w-[70%] lg:mt-[70px] animate__animated animate__fadeInDown"
          link={ROUTE_MAP.register} disabled={false}
        />
      </div>
    </CommonLayout>
  );
};

export default Home;
