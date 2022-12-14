import { useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useAtom } from "jotai";
import { hashAtom } from "@store/atoms";
import LeaderBanner from "@components/Library/LeaderBanner";
import HeaderMenu from "@components/Library/HeaderMenu";
import ConnectWallet from "@components/Library/ConnectWallet";
import axios from "axios";
import {
  IS_PRODUCTION,
  LEADERBOARD_API_PROD,
  LEADERBOARD_API_DEV,
} from "@utils/constants";

async function fetchUserHash(address: `0x${string}` | undefined) {
  const query = { address };
  try {
    const userHashData = await axios.post(
      (IS_PRODUCTION ? LEADERBOARD_API_PROD : LEADERBOARD_API_DEV) + "user",
      JSON.stringify(query)
    );
    return userHashData.data.hash;
  } catch (error) {
    console.error(error);
  }
}

const Profile = () => {
  const { address, isConnected } = useAccount();
  const [_, setHash] = useAtom(hashAtom);

  useEffect(() => {
    if (isConnected) {
      fetchUserHash(address).then((_hash) => {
        setHash(_hash);
      });
    }
  }, [isConnected]);

  return isConnected ? <HeaderMenu address={address} /> : <ConnectWallet />;
};

export default function Header() {
  return (
    <div className="relative flex justify-between items-center w-full px-9 sm:px-11 lg:px-[120px] py-[38px] sm:py-12 z-10 font-bold text-base leading-6 sm:leading-8 text-white transition duration-200">
      <Link href="/">
        <div className="flex flex-col justify-center cursor-pointer">
          <span className="font-bold font-spaceGrotesk text-white text-lg sm:text-2xl leading-[23px] sm:leading-[30px]">
            yieldbay
          </span>
        </div>
      </Link>
      <div className="inline-flex items-center gap-x-4 sm:mr-2">
        <LeaderBanner />
        <Profile />
      </div>
    </div>
  );
}
