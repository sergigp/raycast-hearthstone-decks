import { List } from "@raycast/api";
import { ClassName } from "./types";
import { classIcon } from "./utils";

export default function Command() {
  const classes = Object.values(ClassName);
  return (
    <List>
      {classes.map((className) => (
        <List.Item
          key={className}
          icon={classIcon(className)}
          title={className}
          // actions={<Actions {...deck} />}
        />
      ))}
    </List>
  );
  
  // return (
  //   <Detail
  //     markdown="Ping"
  //     actions={
  //       <ActionPanel>
  //         <Action.Push title="Push Pong" target={<Pong />} />
  //       </ActionPanel>
  //     }
  //   />
  // );
}