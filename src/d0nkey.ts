import axios from "axios";
import * as cheerio from "cheerio";
import { Deck } from "./types";

const D0NKEY_BEST_DECKS_URL = "https://www.d0nkey.top/decks/?format=2";

export const getD0nkeyBestDecks = async () => {
    const response = await axios.get(D0NKEY_BEST_DECKS_URL);
    const $ = cheerio.load(response.data);
    const elements = $("div.card-image");
    const decks: Deck[] = [];

    elements.each((i, el) => {
      const fullText = $(el).find("h2.deck-title").text().trim();
      const title = fullText.split("\n")[0].replace("### ", "").trim();

      const className = $(el)
        .find("div")
        .eq(1)
        .attr("class")
        ?.split(" ")
        .find((cl) => cl !== "decklist-info");

      const code = $(el).find("button[data-clipboard-text]").attr("data-clipboard-text");

      if (title && code && className) {
        decks.push({ title, code, className });
      }
    });

    return decks;
};

