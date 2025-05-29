import axios from 'axios';
import {faker, fi} from '@faker-js/faker';

// rapidum.reirapid.net
const APISERVER=process.env.APISERVER;
const username = process.env.USSERNAME;
const password = process.env.PASSWORD;

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];
const zipCodes = ['10001', '90001', '60601', '77001', '85001', '19103', '78205', '92101', '75201', '95101'];
const streets = [
    'Main St', 'Oak Ave', 'Maple Rd', 'Pine Blvd', 'Elm St', 'Sunset Dr', 
    'Broadway', 'Fifth Ave', 'King St', 'Park Ln'
];
const streetEndings = [
    'St', 'Ave', 'Rd', 'Blvd',  'Dr', 
    'Ct', 'Circle', 'Cir', 'Ln'
];

const streetEnding = [
    'St',
    'Ave',
    'Blvd',
    'Rd',
    'Dr',
    'Ln',
    'Ct',
    'Way',
    'Pl',
    'Sq',
    'Ter',
    'Cir',
    'Hwy',
    'Pkwy',
    'Fwy',
    'Expy',
    'Byp',
    'Ramp',
    'Spur',
    'Loop',
    'Jct',
    'Trl',
    'Path',
    'Walk',
    'Alley',
    'Ln',
    'Row',
    'Cres',
    'Est',
    'Ests',
    'Gdns',
    'Grove',
    'Hts',
    'Hill',
    'Holw',
    'Inlt',
    'Isle',
    'Jct',
    'Knol',
    'Lndg',
    'Mnr',
    'Orch',
    'Park',
    'Pass',
    'Pike',
    'Pne',
    'Pt',
    'Rad',
    'Ridg',
    'Rdge',
    'Rdgs',
    'Riv',
    'Shls',
    'Shr',
    'Skwy',
    'Smt',
    'Spng',
    'Spur',
    'Sq',
    'Strm',
    'Ter',
    'Trce',
    'Trfy',
    'Tunl',
    'Un',
    'Vlg',
    'Vw',
    'Wlk',
    'Wood',
    'Xing'
  ];
  /*
const occupations = [
    'Software Engineer', 'Teacher', 'Doctor', 'Nurse', 'Lawyer', 'Accountant', 'Artist', 
    'Scientist', 'Sales Manager', 'Chef', 'Electrician', 'Plumber', 'Graphic Designer', 
    'Architect', 'Musician'
];
*/
const occupations = [
    'Accountant',
    'Actor',
    'Actuary',
    'Administrator',
    'Advertising Executive',
    'Aerospace Engineer',
    'Agricultural Specialist',
    'Air Traffic Controller',
    'Airline Pilot',
    'Ambulance Driver',
    'Anesthesiologist',
    'Anthropologist',
    'Appraiser',
    'Archaeologist',
    'Architect',
    'Archivist',
    'Art Director',
    'Art Therapist',
    'Artist',
    'Astronomer',
    'Athletic Coach',
    'Athletic Trainer',
    'Attorney',
    'Auditor',
    'Author',
    'Automotive Technician',
    'Aviation Safety Inspector',
    'Bank Manager',
    'Bank Teller',
    'Barber',
    'Biologist',
    'Biomedical Engineer',
    'Biostatistician',
    'Botanist',
    'Broadcast Technician',
    'Budget Analyst',
    'Building Inspector',
    'Business Analyst',
    'Business Manager',
    'Carpenter',
    'Cartographer',
    'Ceramic Engineer',
    'Chemical Engineer',
    'Chemist',
    'Chiropractor',
    'Cinematographer',
    'Civil Engineer',
    'Claims Adjuster',
    'Clinical Psychologist',
    'Clinical Social Worker',
    'Computer Hardware Engineer',
    'Computer Network Support Specialist',
    'Computer Programmer',
    'Computer Scientist',
    'Computer Software Engineer',
    'Computer Systems Analyst',
    'Computer Systems Manager',
    'Conservation Biologist',
    'Construction Manager',
    'Construction Supervisor',
    'Consultant',
    'Contractor',
    'Counselor',
    'Court Reporter',
    'Credit Analyst',
    'Credit Counselor',
    'Criminologist',
    'Curator',
    'Customer Service Representative',
    'Dancer',
    'Data Analyst',
    'Data Scientist',
    'Dental Assistant',
    'Dental Hygienist',
    'Dentist',
    'Dermatologist',
    'Designer',
    'Detective',
    'Diagnostic Medical Sonographer',
    'Dietitian',
    'Director',
    'Doctor',
    'Draftsperson',
    'Economist',
    'Editor',
    'Education Administrator',
    'Electrician',
    'Electrical Engineer',
    'Electronics Engineer',
    'Elementary School Teacher',
    'Emergency Management Director',
    'Emergency Medical Technician',
    'Employment Counselor',
    'Energy Auditor',
    'Engineer',
    'English Teacher',
    'Entomologist',
    'Environmental Scientist',
    'Epidemiologist',
    'Esthetician',
    'Event Planner',
    'Executive',
    'Exercise Physiologist',
    'Farmer',
    'Fashion Designer',
    'Film and Video Editor',
    'Financial Advisor',
    'Financial Analyst',
    'Financial Examiner',
    'Financial Manager',
    'Fire Chief',
    'Fire Fighter',
    'Fire Inspector',
    'Fish and Game Warden',
    'Flight Attendant',
    'Flight Engineer',
    'Food Scientist',
    'Food Service Manager',
    'Forensic Scientist',
    'Forest and Conservation Worker',
    'Forestry Consultant',
    'Geographer',
    'Geologist',
    'Graphic Designer',
    'Groundskeeper',
    'Hairdresser',
    'Hand Therapist',
    'Health Educator',
    'Health Information Manager',
    'Healthcare Administrator',
    'Historian',
    'History Teacher',
    'Home Health Aide',
    'Horticultural Therapist',
    'Hospital Administrator',
    'Hotel Manager',
    'Human Resources Manager',
    'Human Resources Specialist',
    'Hydrologist',
    'Illustrator',
    'Industrial Designer',
    'Industrial Engineer',
    'Information Security Analyst',
    'Information Systems Manager',
    'Insurance Adjuster',
    'Insurance Agent',
    'Insurance Claims Adjuster',
    'Insurance Policy Analyst',
    'Insurance Underwriter',
    'Interior Designer',
    'Interpreter',
    'Interviewer',
    'Investment Banker',
    'Investment Manager',
    'IT Manager',
    'Janitor',
    'Jeweler',
    'Journalist',
    'Judge',
    'Labor Relations Specialist',
    'Laborer',
    'Land Surveyor',
    'Landscaper',
    'Landscape Architect',
    'Law Enforcement Officer',
    'Law Librarian',
    'Lawyer',
    'Lecturer',
    'Librarian',
    'Library Assistant',
    'Library Director',
    'Licensed Practical Nurse',
    'Licensed Vocational Nurse',
    'Linguist',
    'Loan Officer',
    'Locksmith',
    'Logistician',
    'Machine Operator',
    'Magistrate',
    'Maintenance Worker',
    'Management Analyst',
    'Management Consultant',
    'Manager',
    'Manufacturing Engineer',
    'Map Editor',
    'Marine Architect',
    'Marine Biologist',
    'Marine Engineer',
    'Marketing Manager',
    'Marketing Research Analyst',
    'Materials Engineer',
    'Materials Scientist',
    'Mathematician',
    'Mechanical Engineer',
    'Media Specialist',
    'Medical Assistant'
];
    const companies = [
    'TechCorp', 'HealthPlus', 'GreenBuild Inc.', 'Creative Minds', 'InnovateX', 'Global Solutions',
    'EcoEnergy', 'BlueWave Ltd.', 'Elite Enterprises', 'SkyTech Systems'
];

const corporationEndings = [
    'Inc.',
    'Corp.',
    'Ltd.',
    'LLC',
    'Co.',
    'PC',
    'PLLC',
    'PLC',
    'LLP',
    'LP',
    'GP',
    'NPC',
    'Limited',
    'Company',
    'Corporation',
    'Association',
    'Society',
    'Foundation',
    'Trust',
    'Partnership',
    'Venture',
    'Enterprise',
    'Group',
    'Holdings',
    'International'
  ];

function getStateAbbreviation(stateName) {
    const stateAbbreviations = {
      'Alabama': 'AL',
      'Alaska': 'AK',
      'Arizona': 'AZ',
      'Arkansas': 'AR',
      'California': 'CA',
      'Colorado': 'CO',
      'Connecticut': 'CT',
      'Delaware': 'DE',
      'Florida': 'FL',
      'Georgia': 'GA',
      'Hawaii': 'HI',
      'Idaho': 'ID',
      'Illinois': 'IL',
      'Indiana': 'IN',
      'Iowa': 'IA',
      'Kansas': 'KS',
      'Kentucky': 'KY',
      'Louisiana': 'LA',
      'Maine': 'ME',
      'Maryland': 'MD',
      'Massachusetts': 'MA',
      'Michigan': 'MI',
      'Minnesota': 'MN',
      'Mississippi': 'MS',
      'Missouri': 'MO',
      'Montana': 'MT',
      'Nebraska': 'NE',
      'Nevada': 'NV',
      'New Hampshire': 'NH',
      'New Jersey': 'NJ',
      'New Mexico': 'NM',
      'New York': 'NY',
      'North Carolina': 'NC',
      'North Dakota': 'ND',
      'Ohio': 'OH',
      'Oklahoma': 'OK',
      'Oregon': 'OR',
      'Pennsylvania': 'PA',
      'Rhode Island': 'RI',
      'South Carolina': 'SC',
      'South Dakota': 'SD',
      'Tennessee': 'TN',
      'Texas': 'TX',
      'Utah': 'UT',
      'Vermont': 'VT',
      'Virginia': 'VA',
      'Washington': 'WA',
      'West Virginia': 'WV',
      'Wisconsin': 'WI',
      'Wyoming': 'WY'
    };
  
    return stateAbbreviations[stateName];
  }

// Function to generate random test data with street names, occupation, salary, and company name
function generateTestData() {
    const street = `${Math.floor(Math.random() * 1000)} ${streets[Math.floor(Math.random() * streets.length)]}`;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const zip = zipCodes[Math.floor(Math.random() * zipCodes.length)];

    // Randomly choose an occupation
    const occupation = occupations[Math.floor(Math.random() * occupations.length)];

    // Generate a random salary between $30,000 and $150,000
    const salary = Math.floor(Math.random() * (150000 - 30000 + 1)) + 30000;

    // Randomly choose a company
    const company = companies[Math.floor(Math.random() * companies.length)];

    return {
        street,
        city,
        state,
        zip,
        occupation,
        salary,
        company
    };
}


// Function to generate random data
function generateData() {
  
    const city = faker.location.city();
    const state = getStateAbbreviation(faker.location.state()); //faker.location.state();
    const zip = faker.location.zipCode();
   // const street = `${Math.floor(Math.random() * 1000)} ${faker.location.street()} ${streetEnding[Math.floor(Math.random() * streetEnding.length)]}`; //faker.location.street();
    const street = `${Math.floor(Math.random() * 1000)} ${faker.location.street()}`; //faker.location.street();
   
   
    const occupation = faker.person.jobTitle();
    const company = `${faker.company.name()} ${corporationEndings[Math.floor(Math.random() * corporationEndings.length)]}`; //faker.company.name();
    const salary = Math.floor(Math.random() * (250000 - 30000 + 1)) + 30000;

    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const fullName = `${first}.${last}`;
    const email = `${fullName}@${faker.internet.domainName()}`;
    //const email = faker.internet.email();
    const phone = faker.phone.number();
   // const username = faker.internet.username();
    const username = fullName;
    const prefix = faker.person.prefix();
    let suffix = faker.person.suffix();
    if (prefix === 'Ms.' || prefix === 'Mrs.' || prefix==='Miss') { 
        suffix = "";
    }
    if (suffix === 'I') {
        suffix = ""; 
    }
    const middlename    = faker.person.middleName();

    return {
        street,
        city,
        state,
        zip,
        occupation,
        salary,
        company,
        fullName,
        email,
        phone,
        username,   
        first,
        last,
        prefix,
        suffix,
        middlename
    };

}

const rapidCCCreateUser = async(data) => {

    let res={};
    let url = `https://${APISERVER}/rapid/request/newuser`;

    const userData = {
        "username": data.username,
        "password": password,
        "email": data.email,
        "firstName": data.first,
        "lastName": data.last,
        "street1": data.street,
        "city": data.city,
        "state": data.state,
        "zip": data.zip,
        "phone": data.phone,
        "confirmEmail": data.email,
        "apt": "",
        "middlename": data.middlename,
        "prefix": data.prefix,
        "suffix": data.suffix,
        "challengeQuestion": "What is your favorite color?",
        "challengeAnswer": "Blue" ,
        "role": "Users"   }

    const user = {
        data: userData
    }

    try {

       res = await axios.put(url, user, {});

       
    } catch (e) {
        console.error ("Error URL: " + url + " : " +e );
    }

   return res.data;
}





const rapidCCLoginAdmin = async() => {

    let token="";
    let url = `https://${APISERVER}/auth/internal/login/${username}/${password}`;
    try {

        let res = await axios.get(url,{});
        token = res.data.token;

    } catch (e) {
        console.error ("Error URL: " + url + " : " +e);
    }

   return token;
}


const rapidCCLoginUser = async(username, password) => {

    let token="";
    let url = `https://${APISERVER}/auth/internal/login/${username}/${password}`;
    try {

        let res = await axios.get(url,{});
        token = res.data.token;

    } catch (e) {
        console.error ("Error URL: " + url + " : " +e);
    }

   return token;
}


const rapidCCDeleteUser= async(token, username) => {

    let res={};
    let url = `https://${APISERVER}/rapid/delete/user/${username}`;
    try {

        res = await axios.delete(url,{
            headers: {
                Authorization: `Bearer ${token}`,
                },
        });
       

    } catch (e) {
        console.error ("Error URL: " + url + " : " +e );
    }

   return res.data;
}

const rapidCCSendEmail= async(token, addData) => {

   //let addData = generateTestData();
    //let addData = generateData();
    console.log ("generated data: " + JSON.stringify(addData));
    let res={};
    let url = `https://${APISERVER}/rapid/send/message`;
    let putData = {
        "data": {
            "companyName": addData.company,
            "salary": addData.salary,
            "title": addData.occupation,
            "SSN": "*********",
            "street1": addData.street,
            "city": addData.city,
            "state": addData.state,
            "zip": addData.zip
        }
    }
    try {

        res = await axios.put(url, putData,{
            headers: {
                Authorization: `Bearer ${token}`,
                },
        });
       

    } catch (e) {
        console.error ("Error URL: " + url + " : " +e);
    }

   return res.data;
}



const run = async() => {

    const myToken = await rapidCCLoginAdmin();
    if (myToken === "") {
        console.error("Failed to login");
        return;
    }


    let theData = generateData();

    let res1 = await rapidCCCreateUser(theData);

    let pass=password;
    let userToken = await rapidCCLoginUser(theData.username, pass);
    if (userToken === "") {
        console.error("Failed to login");
        return;
    }

    let res = await rapidCCSendEmail(userToken, theData);

    let delres =    await rapidCCDeleteUser(myToken, theData.username);
  
    console.log(res);
    
  
        
}

run();