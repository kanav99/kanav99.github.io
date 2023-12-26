import * as React from "react";
import {
  ChakraProvider,
  Box,
  extendTheme,
  HStack,
  IconButton,
  VStack,
  Heading,
  Link,
  Text,
  Image,
} from "@chakra-ui/react";

import { mode } from "@chakra-ui/theme-tools";

import { FaGithub, FaTwitter } from "react-icons/fa";

const publications = [
  {
    name: "SIGMA: Secure GPT Inference with Function Secret Sharing",
    authors: [
      "Kanav Gupta",
      "Neha Jawalkar",
      "Ananta Mukherjee",
      "Nishanth Chandran",
      "Divya Gupta",
      "Ashish Panwar",
      "Rahul Sharma"
    ],
    links: {
      "eprint": "https://eprint.iacr.org/2023/1269"
    }
  },
  {
    name: "Orca: FSS-based Secure Training and Inference with GPUs",
    authors: [
      "Neha Jawalkar",
      "Kanav Gupta",
      "Arkaprava Basu",
      "Nishanth Chandran",
      "Divya Gupta",
      "Rahul Sharma"
    ],
    links: {
      "eprint" : "https://eprint.iacr.org/2023/206",
      "conference" : "https://www.computer.org/csdl/proceedings-article/sp/2024/313000a063/1RjEaAAmAAE",
    },
    venue: "Oakland '24"
  },
  {
    name: "LLAMA: A Low Latency Math Library for Secure Inference",
    authors: [
      "Kanav Gupta",
      "Deepak Kumaraswamy",
      "Divya Gupta",
      "Nishanth Chandran"
    ],
    links: {
      "eprint" : "https://eprint.iacr.org/2022/793",
      "conference" : "https://petsymposium.org/popets/2022/popets-2022-0109.pdf",
      "talk": "https://www.youtube.com/watch?v=0J5Wea-cvn4"
    },
    venue: "PETS '22"
  }
]

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ 
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: mode("rgb(30, 30, 30)", "rgb(30, 30, 30)")(props),
      }
    })
  },
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export const App = () => {
  const baburao = {
    fontSize: "16px",
    textAlign: "left",
    lineHeight: "29px"
  };
  
  const captionStyle = {
    fontSize: "12px",
    fontStyle: "italic",
    lineHeight: "15px",
    justifyContent: "center",
  };

  const cats = ["cry.jpg", "cool.jpg", "bunger.jpg", "faint.png", "pirate.jpg", "polite.jpg"];
  const captions = [
    "a crying cat watching youtube shorts",
    "a cool cat with raybans",
    "bunger",
    "wild catto fainted",
    "jack spurrow",
    "a polite cat"
  ]

  const idx = getRandomInt(cats.length);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" bg="rgb(30, 30, 30)">
        <HStack
          height={10}
          bg="rgb(45, 45, 45)"
          justify="space-between"
          padding={0}
        >
          <HStack spacing={2} borderColor="rgb(45, 45, 45)" paddingLeft={3}>
            {/* <FaEthereum fontSize={18} /> */}
            <Heading size={"md"}>Kanav Gupta</Heading>
          </HStack>
          <HStack paddingRight={1}>
            <IconButton
              as={Link}
              icon={<FaGithub fontSize={17} />}
              borderRadius={0}
              variant="ghost"
              href="https://github.com/kanav99"
            />
            <IconButton
              as={Link}
              icon={<FaTwitter fontSize={17} />}
              borderRadius={0}
              variant="ghost"
              href="https://x.com/kanavgupta99"
            />
            <IconButton
              as={Link}
              icon={<i class="ai ai-google-scholar" style={{fontSize: "19px"}}></i>}
              borderRadius={0}
              variant="ghost"
              href="https://scholar.google.com/citations?user=QEFy_4wAAAAJ&hl=en"
            />
          </HStack>
        </HStack>
        <VStack height="95vh" paddingTop={5} paddingLeft={3} align="left" style={baburao}>
          <HStack align="top" spacing="20px" paddingRight="20px">
            <VStack align="left">
              <Text>
                I am a PhD student in CS at UMD College Park, where I am advised by Prof. <Link href="https://cs.umd.edu/~jkatz">Jonathan Katz</Link>. My research interest is in secure multi-party computation. 
              </Text>
              <Text>
                Previously, I was a research fellow in EzPC group at Microsoft Research India, advised by Dr. <Link href="https://www.microsoft.com/en-us/research/people/digup/">Divya Gupta</Link>, Dr. <Link href="https://www.microsoft.com/en-us/research/people/nichandr/">Nishanth Chandran</Link>, and Dr. <Link href="https://www.microsoft.com/en-us/research/people/rahsha/">Rahul Sharma </Link>. I graduated with a bachelors degree in computer science from IIT Roorkee under the guidance of Prof. <Link href="https://www.iitr.ac.in/~CSE/Gangopadhyay_Sugata">Sugata Gangopadhyay</Link>.
              </Text>
              <Text>
                During my undergrad, I was a part of <Link href="https://sdslabs.co/">SDSLabs</Link>, a group of enthusiastic students who constantly try to deliver some amazing applications. I enjoy playing Capture-The-Flag (CTF) competitions. I am currently part (on hiatus) of the team <Link href="https://cve.gay/">sillysec</Link>. I like to solve crypto and rev challenges.
              </Text>
              {/* put some space */}
              <Text></Text>
              <Text></Text>
              <Text></Text>
              <Text></Text>
              
              <Heading fontSize="lg">Publications</Heading>
              <VStack align="left">
                {publications.map((pub, i) => <HStack align="top">
                  <Text>{`${i+1}. `}</Text>
                  <VStack align="left">
                    <Text>{pub.name} {Object.keys(pub.links).map((key, _j) => <Link href={pub.links[key]}>{`[${key}]`}</Link>)}</Text>
                    <Text>by {pub.authors.join(", ")}</Text>
                    <Text>{pub.venue ? `at ${pub.venue}` : "In Submission"}</Text>
                  </VStack>
                </HStack>)}
              </VStack>
            </VStack>
            <VStack width="400px" align="center">
              <Image src={`/cats/${cats[idx]}`}/>
              <Text style={captionStyle}>{`${captions[idx]}`}</Text>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};
