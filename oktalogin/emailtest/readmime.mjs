import fs from 'fs/promises';
import path from 'path';



let basePath="./"   
let fileContent="";
let boundaryName="";


async function findMimeBoundary() {

  const filePath = path.join(basePath, 'testemail');
  const fileBuffer = await fs.readFile(filePath);
  fileContent = fileBuffer.toString();
  const boundaryRegex = /boundary="([^"]+)"/;
  const match = fileContent.match(boundaryRegex);
  if (match) {
    const boundaryName = match[1];
    //console.log(`MIME boundary name: ${boundaryName}`);
    return  boundaryName;
  } else {
    console.log('No MIME boundary found');
    return "";
  }
}



async function parseMimeMessage(fileBuffer, boundary) {

  const boundaryRegex = /boundary="([^"]+)"/;
  const match = fileContent.match(boundaryRegex);
  if (match) {
    const boundaryName = match[1];
    const parts = fileContent.split(`--${boundaryName}`);
    const mimeParts = [];
    for (let i = 1; i < parts.length - 1; i++) {
      const part = parts[i].trim();
      const headers = {};
      const headerRegex = /^([A-Za-z-]+): (.*)$/gm;
      let headerMatch;
      while ((headerMatch = headerRegex.exec(part)) !== null) {
        headers[headerMatch[1].toLowerCase()] = headerMatch[2];
      }
      const body = part.replace(headerRegex, '').trim();
      mimeParts.push({ headers, body });
    }
    return mimeParts;
  } else {
    throw new Error('No MIME boundary found');
  }
  return [];
}

function extractSixDigitCode(text) {
    const regex = /\b\d{6}\b/;
    const match = text.match(regex);
    if (match) {
      return match[0];
    } else {
      return null;
    }
  }

  function extractDomainName(headers) {
    const urlRegex = /https?:\/\/([^\/]+)/;
    const url = headers['url'] || headers['URL'];
    if (url) {
      const match = url.match(urlRegex);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  function extractEmailAddress(header) {
    const toRegex = /^To: (.*)$/m;
    const match = header.match(toRegex);
    if (match) {
      const emailAddress = match[1].trim();
      return emailAddress;
    }
    return null;
  }

  function extractMessageId(header) {
    const messageIdRegex = /^Message-ID: (.*)$/m;
    const match = header.match(messageIdRegex);
    if (match) {
      const messageId = match[1].trim().replace(/<|>/g, '');
      return messageId;
    }
    return null;
  }

  function removeLineBreaks(messageBody) {
    return messageBody.replaceAll(/\r\n/g, ' ');
  }

const run = async() => {

   boundaryName = await findMimeBoundary();

  const mimeParts = await parseMimeMessage(fileContent, boundaryName);
  const sixDigitCode = extractSixDigitCode(mimeParts[0].body)
  const domainName = extractDomainName(mimeParts[0].headers);
  const emailAddress = extractEmailAddress(fileContent);
  const messageId = extractMessageId(fileContent);
  const resultData = {
        "verificationCode": sixDigitCode,
        "applicationDomain": domainName,
        "emailAddress": emailAddress,
        "messageId": messageId,
        "body": removeLineBreaks(mimeParts[0].body), //mimeParts[0].body
   }

   console.log(JSON.stringify(resultData));
        
}

run();