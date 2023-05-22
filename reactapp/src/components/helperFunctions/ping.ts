import { SERVER_LINKS } from "../constants/ServerUrl";

export const ping = () => {
    const pingAPI = async () => {
        try {
            const data = await fetch(`${SERVER_LINKS.PING}`, {
                method: "GET",
            });

            const response = await data.text();
            console.log(response);
            return true;
        } catch (error) {
            console.log("error", error);
            return false;
        }
    };

    return pingAPI();
};