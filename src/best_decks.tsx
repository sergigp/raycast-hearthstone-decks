import { Action, ActionPanel, Icon, List, Image } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getD0nkeyBestDecks } from "./d0nkey";
import { Deck } from "./types";

export default function Command() {
  const { data: decks, isLoading } = usePromise(getD0nkeyBestDecks, [], {});

  return (
    <List isLoading={isLoading} isShowingDetail>
      {decks?.map((deck) => (
        <List.Item
          key={deck.code}
          icon={{
            source: `${deck.className}.png`,
            mask: Image.Mask.Circle,
          }}
          title={deck.title}
          accessories={[winrate(deck)]}
          actions={<Actions {...deck} />}
          detail={
            <List.Item.Detail markdown="![Illustration](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png)" />
          }
        />
      ))}
    </List>
  );
}

function Actions({ title, code }: Deck) {
  return (
    <ActionPanel title={title}>
      <ActionPanel.Section>
        <Action.CopyToClipboard content={code} title="Copy Deck Code" shortcut={{ modifiers: ["cmd"], key: "." }} />
      </ActionPanel.Section>
    </ActionPanel>
  );
}

export function winrate(deck: Deck) {
  return { icon: Icon.LineChart, text: `${deck.winrate}%`, tooltip: "winrate"};
}
