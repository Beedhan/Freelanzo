"use client";
import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useReward } from "react-rewards";


const SuccessPage = () => {
  const { reward, isAnimating } = useReward("rewardId", "confetti",{
    elementCount:100,
    elementSize:10,
    lifetime:500
  });
  const { reward:balloonRewards, isAnimating:isBalloonAnimating } = useReward("rewardId", "balloons",{
    elementSize:20,
    lifetime:500
  });

  useEffect(()=>{
    reward();
    balloonRewards();
  },[]);
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className=" flex flex-col items-center justify-center gap-10">
        <button className="button active:scale-90 transition-all" disabled={isAnimating||isBalloonAnimating} onClick={()=>{
          reward();
          balloonRewards();
        }}>
          <span id="rewardId" style={{width: 2, height: 1, background: "red"}}  />
            <CheckCircle size={150} color=" #004AAD" />
        </button>
        <div className="text-center">
          <h1 className="text-6xl font-bold text-green-500">
            PAYMENT SUCCESSFUL
          </h1>
          <br />
          <p className="text-md font-bold text-slate-300">
            You can close this tab now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
