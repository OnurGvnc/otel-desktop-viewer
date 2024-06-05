import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  TabPanel,
  Box,
  AccordionIcon,
  List,
  Heading,
  Tag,
} from "@chakra-ui/react";

import { SpanData } from "../../types/api-types";
import { SpanField } from "./span-field";
import { getDurationNs, getDurationString } from "../../utils/duration";

type FieldsPanelProps = {
  span: SpanData | undefined;
};

export function FieldsPanel(props: FieldsPanelProps) {
  let { span } = props;
  if (!span) {
    return (
      <TabPanel>
        <p>Nothing here yet.</p>
      </TabPanel>
    );
  }

  // Root span: label with a little tag
  let isRoot = span.parentSpanID.length ? false : true;
  let rootTag = isRoot ? (
    <Tag
      marginStart={2}
      colorScheme="cyan"
      variant="subtle"
      size="sm"
    >
      root
    </Tag>
  ) : null;

  // Duration: label in appropriate human-readable time unit (s, ms, μs, ns)

  let durationString = getDurationString(
    getDurationNs(span.startTime, span.endTime),
  );

  // Attributes:
  let spanAttributes = Object.entries(span.attributes).map(([key, value]) => (
    <li key={key}>
      <SpanField
        fieldName={key}
        fieldValue={value}
        attributes={span.attributes}
      />
    </li>
  ));

  let resourceAttributes = Object.entries(span.resource.attributes).map(
    ([key, value]) => (
      <li key={key}>
        <SpanField
          fieldName={key}
          fieldValue={value}
        />
      </li>
    ),
  );

  let scopeAttributes = Object.entries(span.scope.attributes).map(
    ([key, value]) => (
      <li key={key}>
        <SpanField
          fieldName={key}
          fieldValue={value}
        />
      </li>
    ),
  );

  return (
    <TabPanel data-testid="fields-panel" padding="6px 0px 0px" >
      <Accordion
        defaultIndex={[0,1,2]}
        allowMultiple
      >
        <AccordionItem data-testid="span-data" >
          <AccordionButton paddingX="4px" paddingBottom={0}>
            <Box
              flex="1"
              textAlign="left"
            >
              <Heading
                lineHeight="revert"
                size="sm"
                color="orange.400"
              >
                Span Data{rootTag}
              </Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel padding="4px">
            <SpanField
              fieldName="name"
              fieldValue={span.name}
            />
            <SpanField
              fieldName="kind"
              fieldValue={span.kind}
            />
            <SpanField
              fieldName="start time"
              fieldValue={span.startTime}
            />
            <SpanField
              fieldName="end time"
              fieldValue={span.endTime}
            />
            <SpanField
              fieldName="duration"
              fieldValue={durationString}
            />
            <SpanField
              fieldName="status code"
              fieldValue={span.statusCode}
            />
            <SpanField
              fieldName="status message"
              fieldValue={span.statusMessage}
              hidden={span.statusCode === "Unset" || span.statusCode === "Ok"}
            />
            <SpanField
              fieldName="trace id"
              fieldValue={span.traceID}
            />
            <SpanField
              fieldName="parent span id"
              fieldValue={span.parentSpanID}
              hidden={isRoot}
            />
            <SpanField
              fieldName="span id"
              fieldValue={span.spanID}
            />
            <List>{spanAttributes}</List>
            <SpanField
              fieldName="dropped attributes count"
              fieldValue={span.droppedAttributesCount}
              hidden={span.droppedAttributesCount === 0}
            />
            <SpanField
              fieldName="dropped events count"
              fieldValue={span.droppedEventsCount}
              hidden={span.droppedEventsCount === 0}
            />
            <SpanField
              fieldName="dropped links count"
              fieldValue={span.droppedLinksCount}
              hidden={span.droppedLinksCount === 0}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton paddingX="4px" paddingBottom={0}>
            <Box
              flex="1"
              textAlign="left"
            >
              <Heading size="sm" color="orange.400">Resource Data</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel padding="4px" paddingBottom={0}>
            <List>{resourceAttributes}</List>
            <SpanField
              fieldName="dropped attributes count"
              fieldValue={span.resource.droppedAttributesCount}
              hidden={span.resource.droppedAttributesCount === 0}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton paddingX="4px" paddingBottom={0}>
            <Box
              flex="1"
              textAlign="left"
            >
              <Heading size="sm" color="orange.400">Scope Data</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel padding="4px">
            <SpanField
              fieldName="scope name"
              fieldValue={span.scope.name}
            />
            <SpanField
              fieldName="scope version"
              fieldValue={span.scope.version}
            />
            <List>{scopeAttributes}</List>
            <SpanField
              fieldName="dropped attributes count"
              fieldValue={span.scope.droppedAttributesCount}
              hidden={span.scope.droppedAttributesCount === 0}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </TabPanel>
  );
}
