// Utility Imports
import toDollarUnits from "@utils/toDollarUnits";
import {
  formatFirstLetter,
  farmURL,
  formatFarmType,
} from "@utils/farmListMethods";
import { trackEventWithProperty } from "@utils/analytics";

// Component Imports
import Button from "@components/Library/Button";
import FarmAssets from "@components/Library/FarmAssets";
import React from "react";
import FarmBadge from "@components/Library/FarmBadge";
import ShareFarm from "@components/Library/ShareFarm";
import YieldBreakdown from "@components/Library/YieldBreakdown";
import Rewards from "@components/Library/Rewards";

type FarmsListPropsType = {
  farm: any;
  newStyle: object;
  tokenNames: string[];
};

const FarmsList = ({ farm, newStyle, tokenNames }: FarmsListPropsType) => {
  return (
    <tr key={`${farm.asset.address}-${farm.tvl}`} style={newStyle}>
      <td className="whitespace-nowrap min-w-[265px] py-8 text-sm pl-8 md:pl-14 lg:pl-28 w-full">
        <div>
          <div className="flex flex-col gap-y-[10px]">
            <div className="flex flex-row items-center">
              <div className="dark:text-blueSilver font-bold text-base leading-5">
                {tokenNames.map((tokenName: string, index: number) => (
                  <span key={index} className="mr-[3px]">
                    {tokenName}
                    {index !== tokenNames.length - 1 && " •"}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-mediumGray dark:text-[#9397A6] font-medium text-base leading-5">
              {formatFirstLetter(farm?.protocol)} on{" "}
              {formatFirstLetter(farm?.chain)}
            </div>
            <FarmBadge type={formatFarmType(farm?.farmType)} />
          </div>
        </div>
      </td>
      <td className="hidden lg:flex justify-end whitespace-nowrap w-full">
        <FarmAssets logos={farm?.asset.logos} />
      </td>
      <td className="whitespace-nowrap flex justify-end items-center max-w-[300px] py-8 w-full text-right sm:pr-4 sm:pl-6 dark:text-blueSilver font-bold text-base leading-5 tracking-wide">
        {toDollarUnits(farm?.tvl)}
      </td>
      <td className="whitespace-nowrap flex w-full max-w-[300px] py-8 pl-0 dark:text-blueSilver font-bold text-base leading-5 tracking-wide">
        <div className="w-full inline-flex justify-end pr-4 items-center gap-x-2">
          {(farm?.apr.base + farm?.apr.reward).toFixed(2)}%
          <YieldBreakdown base={farm?.apr.base} reward={farm?.apr.reward} />
        </div>
      </td>
      <td className="hidden md:flex justify-start whitespace-nowrap w-full max-w-[300px] h-full py-0 pl-0 lg:pl-6 dark:text-blueSilver font-bold text-base leading-5 tracking-wide">
        <Rewards rewards={farm?.rewards} />
      </td>
      <td className="whitespace-nowrap flex items-center w-full max-w-[288px] py-4 pr-0 md:pr-6 lg:pr-14 text-right text-sm font-medium">
        <div className="flex flex-row gap-x-3 items-center justify-start lg:justify-center">
          <div className="text-center">
            <ShareFarm
              farm={farm}
              apr={(farm?.apr.base + farm?.apr.reward).toFixed(2)}
            />
          </div>
          <a href={farmURL(farm)} target="_blank" rel="noreferrer">
            <Button
              type="secondary"
              size="large"
              onButtonClick={() =>
                trackEventWithProperty("go-to-farm", {
                  protocol: farm?.protocol,
                })
              }
            >
              Visit Farm
            </Button>
          </a>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(FarmsList);
