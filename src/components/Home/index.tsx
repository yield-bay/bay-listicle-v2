// React and Next Imports
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

// Library Imports
import { useAtom } from "jotai";
import { XIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import { trackPageView } from "@utils/analytics";

// Misc Imports
import FarmStats from "@components/Library/FarmStats";
import Tooltip from "@components/Library/Tooltip";
import SelectFarmType from "@components/Library/SelectFarmType";
import useSpecificFarm from "@hooks/useSpecificFarm";
import useFilteredFarmTypes from "@hooks/useFilteredFarmTypes";
import useScreenSize from "@hooks/useScreenSize";
import { fetchListicleFarms } from "@utils/api";
import { protocolCount, tvlCount, protocolList } from "@utils/statsMethods";
import {
  farmQueryAtom,
  filterFarmTypeAtom,
  idQueryAtom,
  showScrollBtnAtom,
} from "@store/atoms";
import ListicleTable from "./ListicleTable";
import useFilteredFarms from "@hooks/useFilteredFarms";
import MobileFarmList from "./MobileFarmList";
import AllProtocolsModal from "@components/Library/AllProtocolsModal";
import SearchInput from "@components/Library/SearchInput";
import ScrollToTopBtn from "@components/Library/ScrollToTopBtn";

const Home = () => {
  const router = useRouter();
  const [filterFarmType] = useAtom(filterFarmTypeAtom);
  const [idQuery, idQuerySet] = useAtom(idQueryAtom);
  const [farmQuery, farmQuerySet] = useAtom(farmQueryAtom);
  const [showScrollBtn, showScrollBtnSet] = useAtom(showScrollBtnAtom);

  // States
  const [farms, setFarms] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [prefModalOpen, setPrefModalOpen] = useState(false);
  const [protocolModalOpen, setProtocolModalOpen] = useState(false);

  // Hooks
  const specificFarm = useSpecificFarm(farms, idQuery, farmQuery);
  const filteredByFarmTypes = useFilteredFarmTypes(farms, filterFarmType);
  const [filteredFarms, noFilteredFarms] = useFilteredFarms(
    filteredByFarmTypes,
    searchTerm
  );
  const screenSize = useScreenSize();

  // state handler for visibility of scroll-to-top button
  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
          showScrollBtnSet(true);
        } else {
          showScrollBtnSet(false);
        }
      });
    }

    return () => {
      window.removeEventListener("scroll", () => {});
    };
  });

  useEffect(() => {
    farmQuerySet(router.query.farm);
    idQuerySet(router.query.id);
  }, [router]);

  useEffect(() => {
    fetchListicleFarms().then((res: any) => {
      setFarms(res.farms);
    });

    trackPageView();
  }, []);

  return (
    <div>
      <Head>
        <title>YieldBay Farms</title>
        <meta
          name="description"
          content="YieldBay List | Discover Yield Farms in DotSama"
        />
        <meta property="og:image" content="/twitter-cover.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>
        {/* THIS IS MAIN CONTAINER -- THIS WILL CONTAIN HERO AND TABLE SECTIONS */}
        <div className="relative flex flex-col flex-1">
          {/* HERO SECTION */}
          <div className="px-6 sm:px-0">
            {/* Center Container */}
            <div className="mx-auto max-w-lg md:max-w-3xl py-6 sm:py-11 md:py-[60px]">
              <h1
                className="mb-7 sm:mb-8 font-spaceGrotesk font-medium text-base px-8 sm:text-3xl md:text-4xl leading-5 sm:leading-10 md:leading-[46px] text-center dark:text-transparent dark:bg-clip-text text-white dark:dark-hero-bg"
                id="hero-heading"
              >
                Discover yield opportunities across multiple protocols and
                parachains on Polkadot and Kusama
              </h1>

              <FarmStats
                totalTVL={tvlCount(farms)}
                totalFarms={farms.length}
                totalProtocols={protocolCount(farms)}
              />
            </div>
            {!idQuery ? (
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between font-medium text-base pt-12 pb-7 sm:py-14 px-3 sm:px-6 md:pl-16 md:pr-8 lg:px-28 font-spaceGrotesk text-white dark:text-blueSilver leading-5">
                <div className="flex items-center justify-between w-full sm:w-max sm:gap-x-5">
                  <div className="hidden sm:block">
                    <SelectFarmType />
                  </div>
                  <div
                    className="sm:hidden"
                    onClick={() => setPrefModalOpen(true)}
                  >
                    <AdjustmentsIcon className="w-6 h-6 rotate-90" />
                  </div>
                  <div className="border-2 min-w-max rounded-[5px] py-1 px-2">
                    {/* TODO: While searching, if there're no farms, then too it shows Loading coz no farms */}
                    {filteredFarms.length == 0
                      ? "Loading..."
                      : `${filteredFarms.length} Results`}
                  </div>
                </div>
                <div className="flex mb-4 sm:mb-0 w-full justify-center sm:justify-end lg:justify-center">
                  <SearchInput term={searchTerm} setTerm={setSearchTerm} />
                </div>
                <button
                  className="hidden lg:inline-flex items-center min-w-max hover:underline gap-x-2 cursor-pointer"
                  onClick={() => setProtocolModalOpen(true)}
                >
                  <div>View All Protocols</div>
                  <Image
                    src="/OpenIcon.svg"
                    alt="open-icon"
                    height={10}
                    width={10}
                  />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center px-6 py-4 sm:py-10 md:px-28 font-spaceGrotesk text-xs sm:text-base text-white leading-5">
                <div className="relative px-4 sm:pl-[22px] sm:pr-11 py-3 w-max rounded-lg dark:bg-baseBlueDark transition duration-200">
                  <p className="font-bold">
                    Showing Yield Farm with address <span>{farmQuery}</span> and
                    pool ID: <span>{idQuery}</span>
                  </p>
                  <Tooltip content={<span>back to all farms</span>}>
                    <button
                      onClick={() => router.push("/")}
                      className="absolute top-2 right-2 sm:top-0 sm:bottom-0 sm:right-5 my-auto cursor-default transition-all duration-200"
                    >
                      <XIcon className="ml-2 w-4 text-blueSilver dark:text-[#999999]" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
          {/* Listicle Table */}
          {screenSize === "xs" ? (
            // MOBILE VIEW
            <div className="sm:hidden bg-white dark:bg-baseBlueDark transition duration-200">
              {!idQuery ? (
                <MobileFarmList
                  farms={filteredFarms}
                  noResult={noFilteredFarms}
                  prefOpen={prefModalOpen}
                  setPrefOpen={setPrefModalOpen}
                />
              ) : (
                <>
                  <MobileFarmList
                    farms={specificFarm}
                    noResult={false}
                    prefOpen={prefModalOpen}
                    setPrefOpen={setPrefModalOpen}
                  />
                  <div className="border-t dark:border-[#222A39] w-full pt-8 pb-9">
                    <div
                      className="py-2 sm:py-4 dark:text-bodyGray font-bold text-sm sm:text-base leading-3 sm:leading-5 text-center cursor-default"
                      onClick={() => router.push("/")}
                    >
                      Go to home
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // DESKTOP VIEW
            <div className="hidden sm:block bg-white dark:bg-baseBlueDark transition duration-200">
              {/* Shows Shared farm if queries are available  */}
              {!idQuery ? (
                <ListicleTable
                  farms={filteredFarms}
                  noResult={noFilteredFarms}
                />
              ) : (
                <ListicleTable farms={specificFarm} noResult={false} />
              )}
              {/* Showing Go to Home if queries or not showing all farms */}
              {(idQuery || filteredFarms.length < farms.length) && (
                <div className="border-t dark:border-[#222A39] w-full pt-8 pb-9">
                  <div
                    className="py-4 dark:text-bodyGray font-bold text-base leading-5 text-center cursor-pointer"
                    onClick={() => {
                      if (idQuery) router.push("/");
                      else router.reload();
                    }}
                  >
                    Go to home
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* {showScrollBtn && <ScrollToTopBtn />} */}
        <AllProtocolsModal
          open={protocolModalOpen}
          setOpen={setProtocolModalOpen}
          protocols={protocolList(farms)}
        />
      </main>
    </div>
  );
};

export default Home;
