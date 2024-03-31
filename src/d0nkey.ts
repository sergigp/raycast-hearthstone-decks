import axios from "axios";
import * as cheerio from "cheerio";
import { Deck } from "./types";

const D0NKEY_BEST_DECKS_URL = "https://www.d0nkey.top/decks/?format=2";

export const getD0nkeyBestDecks = async () => {
  const response = await axios.get(D0NKEY_BEST_DECKS_URL);
  const $ = cheerio.load(response.data);
  const elements = $("div.card");
  const decks: Deck[] = [];

  elements.each((i, el) => {
    const fullText = $(el).find("h2.deck-title").text().trim();
    const title = fullText.split("\n")[0].replace("### ", "").trim();
    const className = $(el)
      .find(".decklist-info")
      .attr("class")
      ?.split(" ")
      .filter((cl) => cl !== "decklist-info")
      .join(" ");

    const code = $(el).find("button[data-clipboard-text]").attr("data-clipboard-text");
    const winrateText = $(el).find("span.basic-black-text").text();
    const dust = parseInt($(el).find("div.dust-bar-inner").text().trim());
    const winrate = winrateText ? parseFloat(winrateText) : null;

    if (title && code && className && winrate) {
      decks.push({ title, code, className, winrate, dust });
    }
  });

  console.log(decks);
  return decks;
};
