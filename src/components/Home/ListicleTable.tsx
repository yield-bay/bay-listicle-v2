// Library Imports
import React, { useEffect, useState, useContext, useRef } from "react";
import { useAtom } from "jotai";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/outline";
import { FixedSizeList, FixedSizeListProps } from "react-window";

// Utility and Component Imports
import {
  sortedFarmsAtom,
  sortStatusAtom,
  showScrollBtnAtom,
} from "@store/atoms";
import FarmsList from "./FarmList";
import Tooltip from "@components/Library/Tooltip";
import { trackEventWithProperty } from "@utils/analytics";
import { formatTokenSymbols } from "@utils/farmListMethods";

enum Order {
  ASC,
  DESC,
}

type ListicleType = {
  farms: any;
  noResult?: boolean;
};

// Main Component
const ListicleTable = ({ farms }: any) => {
  const [vpHeight, setVpHeight] = useState(0);
  const [showScrollBtn] = useAtom(showScrollBtnAtom);
  const [sortStatus, sortStatusSet] = useAtom(sortStatusAtom);
  const [sortedFarms, sortedFarmsSet] = useAtom(sortedFarmsAtom);
  const [hideSkeleton, setHideSkeleton] = useState(false);

  // reference
  const scrollRef = React.createRef<FixedSizeList<any>>();

  useEffect(() => {
    if (farms.length > 0) handleSort(sortStatus.key, false);
  }, [farms]);

  useEffect(() => {
    setVpHeight(window.innerHeight);
  }, []);

  // Sorting function for Table
  const handleSort = (key: string, toggle: boolean) => {
    let newSortStatus: {
      key: string;
      order: number;
    };

    if (toggle) {
      newSortStatus = {
        key,
        order: sortStatus.order == Order.ASC ? Order.DESC : Order.ASC, // Flip the order
      };
      if (key !== sortStatus.key) newSortStatus.order = Order.DESC; // if the key is not same as before, set the Order to DESC
    } else {
      newSortStatus = {
        key,
        order: sortStatus.order,
      };
    }

    sortStatusSet(newSortStatus);

    let sortFn; // to be used to sort the pools
    if (newSortStatus.key == "tvl") {
      sortFn = (a: any, b: any) =>
        newSortStatus.order == Order.ASC
          ? a.tvl >= b.tvl
            ? 1
            : -1
          : a.tvl < b.tvl
          ? 1
          : -1;
    } else if (newSortStatus.key == "yield") {
      sortFn = (a: any, b: any) =>
        newSortStatus.order == Order.ASC
          ? a.apr.reward + a.apr.base >= b.apr.reward + b.apr.base
            ? 1
            : -1
          : a.apr.reward + a.apr.base < b.apr.reward + b.apr.base
          ? 1
          : -1;
    }

    sortedFarmsSet([...farms].sort(sortFn));
  };

  // Context for cross component communication
  const VirtualTableContext = React.createContext<{
    top: number;
    setTop: (top: number) => void;
    header: React.ReactNode;
  }>({
    top: 0,
    setTop: (value: number) => {},
    header: <></>,
  });

  // Virtual Table. It basically accepts all of the same params as the original FixedSizeList
  function VirtualTable({
    row,
    header,
    ...rest
  }: {
    row: FixedSizeListProps["children"];
    header?: React.ReactNode;
  } & Omit<FixedSizeListProps, "children" | "innerElementType">) {
    // const listRef = useRef<FixedSizeList | null>();
    const [top, setTop] = useState(0);

    return (
      <VirtualTableContext.Provider value={{ top, setTop, header }}>
        <FixedSizeList
          {...rest}
          innerElementType={Inner}
          onItemsRendered={(props) => {
            const style =
              scrollRef.current &&
              // @ts-ignore private method access
              scrollRef.current._getItemStyle(props.overscanStartIndex);
            setTop((style && style.top) || 0);

            // call the original callback
            rest.onItemsRendered && rest.onItemsRendered(props);
          }}
          ref={(el) => scrollRef.current == el}
        >
          {row}
        </FixedSizeList>
      </VirtualTableContext.Provider>
    );
  }

  /*
  The Inner component of the virtual list. This is the real deal.
  Capture what would have been the top elements position and apply it to the table
  Other than that, render the header.
*/
  const Inner = React.forwardRef<
    HTMLDivElement,
    React.HTMLProps<HTMLDivElement>
  >(function Inner({ children, ...rest }, ref) {
    const { header, top } = useContext(VirtualTableContext);
    return (
      <div {...rest} ref={ref}>
        <table style={{ top, position: "absolute", width: "100%" }}>
          {header}
          <tbody className="divide-y divide-[#D9D9D9] dark:divide-[#222A39] transition duration-200">
            {children}
          </tbody>
        </table>
      </div>
    );
  });

  // Row components. This should be the table row. We aren't using the style that regulat react-window egs. passes in
  function Row({ index, style }: { index: number; style: any }) {
    let newStyle = {
      ...style,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      top: style.top + 82,
    };
    const farm = sortedFarms[index];
    const tokenNames = formatTokenSymbols(farm?.asset.symbol);
    return (
      <FarmsList farm={farm} tokenNames={tokenNames} newStyle={newStyle} />
    );
  }

  return (
    <>
      <VirtualTable
        height={
          sortedFarms.length >= 8 ? vpHeight : 142 * sortedFarms.length + 82
        }
        width="100%"
        itemCount={sortedFarms.length}
        itemSize={142}
        header={
          <thead className="transition duration-200 font-bold text-base leading-5">
            <div className="flex flex-row justify-between">
              <div className="pt-9 min-w-[265px] py-8 w-full pb-6 pr-4 2xl:pr-8 text-left dark:text-blueSilver pl-8 md:pl-14 lg:pl-28">
                <span>Farm</span>
              </div>
              <div className="hidden lg:flex justify-end w-full pr-0">
                <span className="sr-only">Farm Assets</span>
              </div>
              <div
                className="px-3 w-full cursor-pointer pt-9 pb-6 md:pr-3 sm:pl-0 dark:text-blueSilver"
                onClick={() => {
                  handleSort("tvl", true);
                  trackEventWithProperty("table-sorting", {
                    sortingType: "tvl",
                  });
                }}
              >
                <Tooltip
                  content={
                    <span>
                      Total Value Locked. Amount of money currently invested in
                      the farm, denoted in USD.
                    </span>
                  }
                >
                  <div className="flex justify-center lg:justify-end items-center pr-6 w-full">
                    <span>TVL</span>
                    {sortStatus.key == "tvl" &&
                      (sortStatus.order == Order.DESC ? (
                        <ChevronDownIcon className="w-3 h-3 inline -mt-0.5 ml-2" />
                      ) : (
                        <ChevronUpIcon className="w-3 h-3 inline mb-0.5 ml-2" />
                      ))}
                  </div>
                </Tooltip>
              </div>
              <div
                className="flex w-full justify-start lg:justify-end pr-0 pt-9 pb-6 items-center dark:text-blueSilver cursor-pointer"
                onClick={() => {
                  handleSort("yield", true);
                  trackEventWithProperty("table-sorting", {
                    sortingType: "yield",
                  });
                }}
              >
                <Tooltip
                  content={
                    <span>
                      The percentage of returns the farm offers on staking for
                      an year.
                    </span>
                  }
                >
                  <div className="w-full text-right pr-12">
                    <span>APR</span>
                    {sortStatus.key == "yield" &&
                      (sortStatus.order == Order.DESC ? (
                        <ChevronDownIcon className="w-3 h-3 inline -mt-0.5 ml-2" />
                      ) : (
                        <ChevronUpIcon className="w-3 h-3 inline mb-0.5 ml-2" />
                      ))}
                  </div>
                </Tooltip>
              </div>
              <div className="hidden md:flex justify-start w-full text-left pt-9 pb-6 dark:text-blueSilver">
                <span className="w-full">Rewards</span>
              </div>
              <div className="pt-9 w-full pb-6 pl-20 lg:pl-8 2xl:pl-0 pr-0">
                <span className="sr-only">Visit Farm</span>
              </div>
            </div>
          </thead>
        }
        row={Row}
      />

      {/* Scroll-to-top Button */}
      {showScrollBtn && (
        <button
          className="fixed bottom-20 sm:bottom-[80px] right-12 sm:right-[120px] z-20 p-[10px] rounded-full hover:scale-105 active:scale-100 bg-bodyGray dark:bg-primaryBlue transition-all ease-in-out duration-200"
          onClick={() => {
            if (typeof window !== undefined) {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
            scrollRef.current?.scrollToItem(0, "smart");
          }}
        >
          <ArrowUpIcon className="w-5 text-primaryBlue dark:text-white transition duration-200" />
        </button>
      )}
    </>
  );
};

export default React.memo(ListicleTable);
