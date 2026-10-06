export const rawEdiSpec = `ISA*00*          *00*          *ZZ*SENDERID       *ZZ*RECEIVERID     *231024*1430*U*00401*000000001*0*T*:~
GS*PO*SENDERID*RECEIVERID*20231024*1430*1*X*004010~
ST*850*0001~
BEG*00*SA*PO123456**20231024~
REF*VN*VEND999~
PER*BD*JANE DOE*TE*5551234567*EM*JANE@EXAMPLE.COM~
FOB*PP~
ITD*01*3*2*30**15~
DTM*002*20231101~
TD5*O*2*UPSN*U*UPS GROUND~
N1*ST*WAREHOUSE 1*92*WH001~
N3*123 LOGISTICS WAY~
N4*ANYTOWN*CA*90210*US~
PO1*1*100*EA*15.50*PE*VN*ITM-001~
PID*F****WIDGET A~
PO1*2*50*EA*25.00*PE*VN*ITM-002~
PID*F****WIDGET B~
CTT*2*150~
SE*18*0001~
GE*1*1~
IEA*1*000000001~`;

export const generatedCodeLines = [
  "import { EdiParser } from '@logistics-studio/edi';",
  "import { OrderEvent } from '../types';",
  "",
  "export function map850ToOrder(rawEdi: string): OrderEvent {",
  "  const parser = new EdiParser(rawEdi);",
  "  const begSegment = parser.getSegment('BEG');",
  "  const n1Segment = parser.getSegment('N1', { qualifier: 'ST' });",
  "  ",
  "  return {",
  "    orderId: begSegment.getElement(3), // PO123456",
  "    orderDate: begSegment.getElement(5), // 20231024",
  "    vendorId: parser.getSegment('REF', { qualifier: 'VN' }).getElement(2),",
  "    shipTo: {",
  "      locationId: n1Segment.getElement(4),",
  "      name: n1Segment.getElement(2),",
  "      address: parser.getSegment('N3').getElement(1),",
  "      city: parser.getSegment('N4').getElement(1),",
  "      state: parser.getSegment('N4').getElement(2),",
  "      zip: parser.getSegment('N4').getElement(3),",
  "    },",
  "    items: parser.getSegments('PO1').map(po1 => ({",
  "      lineId: po1.getElement(1),",
  "      quantity: parseInt(po1.getElement(2)),",
  "      unitPrice: parseFloat(po1.getElement(4)),",
  "      sku: po1.getElement(7),",
  "    })),",
  "  };",
  "}",
];

export const progressSteps = [
  "Upload spec",
  "AI analyzes",
  "Map generated",
  "Validated"
];
