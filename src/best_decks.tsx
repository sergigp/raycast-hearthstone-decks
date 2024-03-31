import { usePromise } from "@raycast/utils";
import { getD0nkeyBestDecks } from "./d0nkey";
import { DeckList } from "./decklist";

export default function Command() {
  const { data: decks, isLoading } = usePromise(getD0nkeyBestDecks, [], {});

  return <DeckList isLoading={isLoading} decks={decks ? decks : []} />;
}
