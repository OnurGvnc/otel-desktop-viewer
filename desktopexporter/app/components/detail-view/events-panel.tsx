import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  List,
  TabPanel,
  Text,
} from "@chakra-ui/react";

import { EventData } from "../../types/api-types";
import { SpanField } from "./span-field";
import { getDurationNs, getDurationString } from "../../utils/duration";

type EventItemProps = {
  event: EventData;
  spanStartTime: string;
};

function EventItem(props: EventItemProps) {
  let { event, spanStartTime } = props;
  let timeSinceSpanStart = getDurationNs(spanStartTime, event.timestamp);
  let durationString = getDurationString(timeSinceSpanStart);
  let eventAttributes = Object.entries(event.attributes).map(([key, value]) => (
    <li key={key + value?.toString()}>
      <SpanField
        fieldName={key}
        fieldValue={value}
      />
    </li>
  ));

  return (
    <AccordionItem>
      <AccordionButton paddingX="4px" paddingBottom={0}>
        <Box
          flex="1"
          textAlign="left"
        >
          <Heading size="sm">{event.name}</Heading>
          <Text fontSize="xs">{durationString} since span start</Text>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel padding="4px" paddingBottom={0}>
        <SpanField
          fieldName="timestamp"
          fieldValue={event.timestamp}
        />
        <List>{eventAttributes}</List>
        <SpanField
          fieldName="dropped attributes count"
          fieldValue={event.droppedAttributesCount}
          hidden={!event.droppedAttributesCount}
        />
      </AccordionPanel>
    </AccordionItem>
  );
}

type EventsPanelProps = {
  events: EventData[] | undefined;
  spanStartTime: string;
};

export function EventsPanel(props: EventsPanelProps) {
  let { events, spanStartTime } = props;
  if (!events) {
    return null;
  }

  let eventItemList = events.map((event) => (
    <li key={event.name + event.timestamp}>
      <EventItem
        event={event}
        spanStartTime={spanStartTime}
      />
    </li>
  ));

  return (
    <TabPanel data-testid="events-panel" padding="6px 0px 0px" >
      <Accordion allowMultiple>
        <List>{eventItemList}</List>
      </Accordion>
    </TabPanel>
  );
}
