import React from "react";
import {
  Flex,
  Box,
  Tag,
  Text,
  TagLabel,
  useColorModeValue,
} from "@chakra-ui/react";

import { format as sqlFormat } from 'sql-formatter';

type SpanFieldProps = {
  fieldName: string;
  fieldValue: number | string | boolean | null;
  hidden?: boolean;
  attributes?: { [key: string]: number | string | boolean | null };
};

export function SpanField(props: SpanFieldProps) {
  let { fieldName, fieldValue, hidden } = props;
  let fieldNameColour = useColorModeValue("gray.600", "gray.400");

  if (hidden) {
    return null;
  }
  let typeOfFieldValue :string = typeof fieldValue;

  // if array?
  if (Array.isArray(fieldValue)) {
    typeOfFieldValue = "array";
    fieldValue = JSON.stringify(fieldValue);
  }

  switch (fieldValue) {
    case true:
      fieldValue = "true";
      break;
    case false:
      fieldValue = "false";
      break;
    case null:
      fieldValue = "null";
      break;
    case undefined:
      fieldValue = "undefined";
      break;
    case "":
      fieldValue = '""';
      break;
  }


  let clipboardContent = fieldValue;

  let fieldContentElement: JSX.Element | null = null;
  let htmlContent :string | null = null;
  if(props.attributes?.['db.system']=='sql server' && fieldName=='db.statement'){

    let params: any[] = [];
    if(props.attributes?.['db.params']){
      params = JSON.parse(props.attributes['db.params'] as string);
    }

    htmlContent = fieldValue as string;
    htmlContent = sqlFormat(htmlContent ,{
      language: 'sqlite',
      tabWidth: 2,
      keywordCase: 'lower',
      linesBetweenQueries: 2,
      newlineBeforeSemicolon: true,
      logicalOperatorNewline: 'before',
      indentStyle:'standard',
      params: params.map(x=>JSON.stringify(x).replaceAll(`"`, `'`)),
    });
    fieldContentElement= <pre dangerouslySetInnerHTML={{__html:htmlContent}} />
    clipboardContent = htmlContent
  }


  if(fieldName=='code.reference'){
    const rawValue = fieldValue as string;
    const matches = rawValue.match(/\(([^)]+)\)/);
    if(matches && matches.length>1){
      const fileAndLine = matches[1];
      fieldContentElement = <div>
        <div>{rawValue}</div>
        <a href={`vscode://file${fileAndLine}`} style={{
          border: '1px solid #696969',
          padding: '4px 4px 2px',
          borderRadius: '4px'
        }}>
          Open File in VSCode
        </a>
      </div>
    }
  }

  return (
    <Box paddingTop={2}>
      <dt>
        <Flex experimental_spaceX={2}>
          <Text
            textColor={fieldNameColour}
            fontSize="sm"
          >
            {fieldName}
          </Text>
          <Text
            textColor={fieldNameColour}
            fontSize="sm"
            marginLeft={4}
            color="blue.500"
            opacity={0.5}
          >
            :{typeOfFieldValue}
          </Text>
        </Flex>
      </dt>
      <dd>
        <Text
          fontSize="sm"
          paddingY={0}
          onClick={() => {
            navigator.clipboard.writeText(clipboardContent+'')
          }}
        >
          {/* {htmlContent ? <div dangerouslySetInnerHTML={{__html: htmlContent}} /> : fieldValue} */}
          {fieldContentElement ? fieldContentElement : fieldValue}
        </Text>
      </dd>
    </Box>
  );
}
