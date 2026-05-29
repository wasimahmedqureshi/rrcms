import { PrismaClient } from '@prisma/client';
import { hashSync } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Create Offices
  const offices = await Promise.all([
    prisma.office.upsert({
      where: { officeName: 'ACEM Fast Track, Niwai' },
      update: {},
      create: {
        officeName: 'ACEM Fast Track, Niwai',
        officeCode: 'ACEM-NIW',
        district: 'Tonk',
        address: 'Niwai, District Tonk, Rajasthan',
      },
    }),
    prisma.office.upsert({
      where: { officeName: 'SDO Office, Tonk' },
      update: {},
      create: {
        officeName: 'SDO Office, Tonk',
        officeCode: 'SDO-TONK',
        district: 'Tonk',
        address: 'Tonk, Rajasthan',
      },
    }),
    prisma.office.upsert({
      where: { officeName: 'Revenue Board, Jaipur' },
      update: {},
      create: {
        officeName: 'Revenue Board, Jaipur',
        officeCode: 'RB-JPR',
        district: 'Jaipur',
        address: 'Jaipur, Rajasthan',
      },
    }),
    prisma.office.upsert({
      where: { officeName: 'Tehsildar Office, Deoli' },
      update: {},
      create: {
        officeName: 'Tehsildar Office, Deoli',
        officeCode: 'TEH-DEL',
        district: 'Tonk',
        address: 'Deoli, District Tonk, Rajasthan',
      },
    }),
  ]);

  // Create Sections
  const sections = await Promise.all([
    prisma.section.upsert({
      where: { sectionName: 'Land Revenue' },
      update: {},
      create: {
        sectionName: 'Land Revenue',
        sectionCode: 'LR',
        description: 'Cases related to land revenue assessment and collection',
      },
    }),
    prisma.section.upsert({
      where: { sectionName: 'Land Acquisition' },
      update: {},
      create: {
        sectionName: 'Land Acquisition',
        sectionCode: 'LA',
        description: 'Cases related to land acquisition by government',
      },
    }),
    prisma.section.upsert({
      where: { sectionName: 'Mutation Cases' },
      update: {},
      create: {
        sectionName: 'Mutation Cases',
        sectionCode: 'MC',
        description: 'Cases related to name transfer in land records',
      },
    }),
    prisma.section.upsert({
      where: { sectionName: 'Partition Cases' },
      update: {},
      create: {
        sectionName: 'Partition Cases',
        sectionCode: 'PC',
        description: 'Cases related to partition of ancestral property',
      },
    }),
    prisma.section.upsert({
      where: { sectionName: 'Appeal Cases' },
      update: {},
      create: {
        sectionName: 'Appeal Cases',
        sectionCode: 'AC',
        description: 'Appeal cases against orders of lower authorities',
      },
    }),
  ]);

  // Create Admin User
  const hashedPassword = Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode('admin123')
      )
    )
  )
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@rrcms.gov.in' },
    update: {},
    create: {
      email: 'admin@rrcms.gov.in',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
    },
  });

  // Create Sample Pending Cases
  const pendingCases = [
    {
      caseNo: 'RC/2024/0001',
      sectionId: sections[0].id,
      institutionDate: new Date('2024-01-15'),
      purpose: 'Land Revenue Dispute - Agricultural Land',
      appellant: 'Ramesh Kumar s/o Shri Lal',
      respondent: 'State of Rajasthan',
      hearingDate: new Date('2024-06-20'),
      officeId: offices[0].id,
    },
    {
      caseNo: 'RC/2024/0002',
      sectionId: sections[1].id,
      institutionDate: new Date('2024-02-10'),
      purpose: 'Compensation Dispute for NHAI Land Acquisition',
      appellant: 'Suresh Sharma s/o Mohan Lal',
      respondent: 'National Highways Authority of India',
      hearingDate: new Date('2024-07-15'),
      officeId: offices[1].id,
    },
    {
      caseNo: 'RC/2023/0145',
      sectionId: sections[2].id,
      institutionDate: new Date('2023-06-20'),
      purpose: 'Mutation Request for Inherited Property',
      appellant: 'Mahesh Singh s/o Kishan Singh',
      respondent: 'Patwari Circle Niwai',
      hearingDate: new Date('2024-05-28'),
      officeId: offices[0].id,
    },
    {
      caseNo: 'RC/2022/0089',
      sectionId: sections[3].id,
      institutionDate: new Date('2022-03-15'),
      purpose: 'Partition of Ancestral Agricultural Land',
      appellant: 'Kamla Devi w/o Late Ram Lal',
      respondent: 'Heirs of Ram Lal',
      officeId: offices[2].id,
    },
    {
      caseNo: 'RC/2021/0234',
      sectionId: sections[4].id,
      institutionDate: new Date('2021-08-10'),
      purpose: 'Appeal Against Tehsildar Order',
      appellant: 'Gopal Joshi s/o Brij Lal',
      respondent: 'Tehsildar Office Deoli',
      officeId: offices[3].id,
    },
    {
      caseNo: 'RC/2020/0056',
      sectionId: sections[0].id,
      institutionDate: new Date('2020-05-20'),
      purpose: 'Revenue Assessment Appeal',
      appellant: 'Lakhan Singh s/o Raghuveer Singh',
      respondent: 'Revenue Department',
      officeId: offices[1].id,
    },
    {
      caseNo: 'RC/2019/0078',
      sectionId: sections[1].id,
      institutionDate: new Date('2019-11-15'),
      purpose: 'Land Acquisition Compensation Enhancement',
      appellant: 'Vijay Kumar s/o Pratap Singh',
      respondent: 'PWD Rajasthan',
      officeId: offices[2].id,
    },
    {
      caseNo: 'RC/2018/0123',
      sectionId: sections[2].id,
      institutionDate: new Date('2018-07-25'),
      purpose: 'Mutation Entry Correction',
      appellant: 'Mohan Lal s/o Kishori Lal',
      respondent: 'Patwari Circle Tonk',
      officeId: offices[0].id,
    },
  ];

  for (const caseData of pendingCases) {
    await prisma.pendingCase.upsert({
      where: {
        caseNo_officeId: {
          caseNo: caseData.caseNo,
          officeId: caseData.officeId,
        },
      },
      update: {},
      create: caseData,
    });
  }

  // Create Sample Disposed Cases
  const disposedCases = [
    {
      caseNo: 'RC/2023/0056',
      sectionId: sections[0].id,
      institutionDate: new Date('2023-01-10'),
      disposalDate: new Date('2024-01-20'),
      purpose: 'Land Revenue Assessment - Final Order',
      appellant: 'Lakhan Singh s/o Raghuveer Singh',
      respondent: 'State of Rajasthan',
      officeId: offices[0].id,
      disposalType: 'Order Passed',
      disposalRemarks: 'Case decided in favor of appellant',
    },
    {
      caseNo: 'RC/2023/0078',
      sectionId: sections[1].id,
      institutionDate: new Date('2023-03-15'),
      disposalDate: new Date('2024-02-28'),
      purpose: 'Compensation Award Enhancement',
      appellant: 'Vijay Kumar s/o Pratap Singh',
      respondent: 'PWD Rajasthan',
      officeId: offices[1].id,
      disposalType: 'Settled',
      disposalRemarks: 'Mutual settlement reached',
    },
    {
      caseNo: 'RC/2022/0034',
      sectionId: sections[2].id,
      institutionDate: new Date('2022-05-10'),
      disposalDate: new Date('2023-11-20'),
      purpose: 'Mutation Entry Corrected',
      appellant: 'Sita Ram s/o Gopal Ram',
      respondent: 'Patwari Circle Deoli',
      officeId: offices[3].id,
      disposalType: 'Order Passed',
      disposalRemarks: 'Mutation entry corrected as per revenue records',
    },
  ];

  for (const caseData of disposedCases) {
    await prisma.disposedCase.upsert({
      where: {
        caseNo_officeId: {
          caseNo: caseData.caseNo,
          officeId: caseData.officeId,
        },
      },
      update: {},
      create: caseData,
    });
  }

  console.log('Seed data created successfully!');
  console.log(`Offices: ${offices.length}`);
  console.log(`Sections: ${sections.length}`);
  console.log(`Pending Cases: ${pendingCases.length}`);
  console.log(`Disposed Cases: ${disposedCases.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
