import axios from "axios";
import * as cheerio from "cheerio";
import { Card, CardSlot, ClassName, Deck, Rarity } from "./types";

const D0NKEY_BEST_DECKS_URL = "https://www.d0nkey.top/decks/?format=2";
const d0nkeyBestDecksPerClassUrl = (className: ClassName) => {
  return `https://www.d0nkey.top/decks/?format=2&player_class=${className}`;
};

export const getD0nkeyBestDecks = async () => {
  return fetchDecks(D0NKEY_BEST_DECKS_URL);
};

export const getD0nkeyBestDecksByClass = async (className: ClassName) => {
  return fetchDecks(d0nkeyBestDecksPerClassUrl(className));
};

export const fetchDecks = async (url: string) => {
  const response = await axios.get(url);
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
      .join(" ") as ClassName;

    const code = $(el).find("button[data-clipboard-text]").attr("data-clipboard-text");
    const winrateText = $(el).find("span.basic-black-text").text();
    const dust = parseInt($(el).find("div.dust-bar-inner").text().trim());
    const winrate = winrateText ? parseFloat(winrateText) : null;
    const cardContainers = $(el).find("div.decklist_card_container");
    const slots = cardContainers
      .map((i, card) => {
        const cardName = $(card).find("div.card-name").text();
        const rarity = parseCardRarity(card);
        return parseCard(cardName, rarity);
      })
      .toArray()
      .sort((a, b) => a.card.mana - b.card.mana) as CardSlot[];

    if (title && code && className && winrate && dust && slots.length > 0) {
      decks.push({ title, code, className, winrate, dust, slots });
    }
  });

  return decks;
};

const parseCard = (text: string, rarity: Rarity): CardSlot => {
  const regex = /# (\d+)x \((\d+)\)\s*(.+)/;
  const match = text.match(regex);

  if (!match) {
    throw new Error("Invalid card text format");
  }

  const [, amount, mana, title] = match;

  const card: Card = {
    title: title.trim(),
    rarity: rarity,
    mana: parseInt(mana, 10),
  };

  if (rarity === Rarity.LEGENDARY) {
    return {
      card,
      amount: 1,
    };
  } else {
    return {
      card,
      amount: parseInt(amount, 10) as 1 | 2,
    };
  }
};

const parseCardRarity = (cardContainer: cheerio.Element): Rarity => {
  const $ = cheerio.load(cardContainer);

  const styleAttr = $(cardContainer).find(".decklist-card").attr("style") || "";

  if (styleAttr.includes("--color-dark-legendary")) {
    return Rarity.LEGENDARY;
  } else if (styleAttr.includes("--color-dark-epic")) {
    return Rarity.EPIC;
  } else if (styleAttr.includes("--color-dark-rare")) {
    return Rarity.RARE;
  } else {
    return Rarity.COMMON;
  }
};
