import Link from "next/link";
import React from "react";
import { Progress } from "./ui/progress";



type Props = {
    userId: string | undefined;
}

const UpgradeButton: React.FC<Props> = async ({ }) => {
   const isSubscribed=false; 


    return (
        <div className="m-3">
            {isSubscribed ? (
                <span className="text-sm">
                    You have a subscription plan, you are eligble to create more forms
                </span>
            ) : (
                <>
                    <Progress/>
                    <p>
                        2 out of 3 forms generated.{" "}
                        <Link
                            href={"/dashboard/upgrade"}
                            className="text-blue-600 underline"
                        >
                            {" "}
                            Upgrade{" "}
                        </Link>{" "}
                        to generate more forms
                    </p>
                </>
            )}
        </div>
    );
};

export default UpgradeButton;