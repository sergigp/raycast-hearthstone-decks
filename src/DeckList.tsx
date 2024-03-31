import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { CardSlot, Deck } from "./types";
import { classIcon } from "./utils";

type DeckListProps = {
  isLoading: boolean;
  decks: Deck[];
};

export const DeckList: React.FC<DeckListProps> = ({ isLoading, decks }) => {
  return (
    <List isLoading={isLoading} isShowingDetail>
      {decks?.map((deck) => (
        <List.Item
          key={deck.code}
          icon={classIcon(deck.className)}
          title={deck.title}
          accessories={[winrate(deck), dust(deck)]}
          actions={<Actions {...deck} />}
          detail={<DeckDetails {...deck} />}
        />
      ))}
    </List>
  );
};

function Actions({ title, code }: Deck) {
  return (
    <ActionPanel title={title}>
      <ActionPanel.Section>
        <Action.CopyToClipboard content={code} title="Copy Deck Code" shortcut={{ modifiers: ["cmd"], key: "." }} />
      </ActionPanel.Section>
    </ActionPanel>
  );
}

function DeckDetails({ slots }: Deck) {
  return <List.Item.Detail markdown={generateMarkdownList(slots)} />;
}

const generateMarkdownList = (cardSlots: CardSlot[]): string => {
  let markdown = "";

  cardSlots.forEach((slot) => {
    markdown += `* ${slot.amount}x (${slot.card.mana})  ${slot.card.title}\n`;
  });

  return markdown;
};

const winrate = (deck: Deck) => {
  return { icon: Icon.LineChart, text: `${deck.winrate}%`, tooltip: "winrate" };
};

const dust = (deck: Deck) => {
  return { icon: Icon.Raindrop, text: formatNumberWithK(deck.dust), tooltip: "dust" };
};

const formatNumberWithK = (number: number): string => {
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return number.toString();
};
