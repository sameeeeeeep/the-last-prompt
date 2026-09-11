// Learner affiliations supplied by the site owner. Logo source URLs document artwork, not partnerships.
// Map markers represent the named campus locations, not training venues or company branches.
export const verifiedTrainingHistory = {
  "locations": [
    {
      "name": "Mumbai",
      "lat": 19.076,
      "lon": 72.8777,
      "institutions": [
        "IIT Bombay",
        "NMIMS",
        "ATLAS SkillTech University"
      ]
    },
    {
      "name": "Goa",
      "lat": 15.391,
      "lon": 73.879,
      "institutions": [
        "BITS Goa"
      ]
    },
    {
      "name": "Hyderabad",
      "lat": 17.435,
      "lon": 78.34,
      "institutions": [
        "Indian School of Business"
      ]
    },
    {
      "name": "Pune",
      "lat": 18.5204,
      "lon": 73.8567,
      "institutions": [
        "Sinhgad Academy of Engineering",
        "Savitribai Phule Pune University"
      ]
    }
  ],
  "organisations": [
    {
      "id": "iit-bombay",
      "name": "IIT Bombay",
      "logo": "./logos/iit-bombay.png",
      "source": "https://gymkhana.iitb.ac.in/",
      "width": 360,
      "height": 360,
      "caption": "IIT Bombay"
    },
    {
      "id": "deloitte",
      "name": "Deloitte",
      "logo": "./logos/deloitte.png",
      "source": "https://www.deloitte.com/no/no/legal/bilder-logo-media.html",
      "width": 1614,
      "height": 656,
      "scale": 1.32
    },
    {
      "id": "bits-goa",
      "name": "BITS Goa",
      "logo": "./logos/bits-goa.png",
      "source": "https://admissions.bits-pilani.ac.in/header.html",
      "width": 628,
      "height": 183,
      "caption": "K. K. Birla Goa Campus"
    },
    {
      "id": "pwc",
      "name": "PwC",
      "logo": "./logos/pwc.svg",
      "source": "https://www.pwc.com/gx/en.html",
      "width": 70,
      "height": 53
    },
    {
      "id": "icici-bank",
      "name": "ICICI Bank",
      "logo": "./logos/icici-bank.svg",
      "source": "https://www.icicibank.com/",
      "width": 155,
      "height": 32
    },
    {
      "id": "isb-hyderabad",
      "name": "ISB Hyderabad",
      "logo": "./logos/isb-hyderabad.svg",
      "source": "https://www.isb.edu/",
      "width": 150,
      "height": 64,
      "caption": "Hyderabad"
    },
    {
      "id": "hdfc-bank",
      "name": "HDFC Bank",
      "logo": "./logos/hdfc-bank.svg",
      "source": "https://www.hdfcbank.com/",
      "width": 178,
      "height": 35
    },
    {
      "id": "kpmg",
      "name": "KPMG",
      "logo": "./logos/kpmg.svg",
      "source": "https://kpmg.com/in/en.html",
      "width": 77,
      "height": 30
    },
    {
      "id": "nmims-mumbai",
      "name": "NMIMS Mumbai",
      "logo": "./logos/nmims-mumbai.png",
      "source": "https://www.nmims.edu/",
      "width": 281,
      "height": 118,
      "caption": "Mumbai"
    },
    {
      "id": "ey",
      "name": "EY",
      "logo": "./logos/ey.svg",
      "source": "https://www.ey.com/en_us",
      "width": 92,
      "height": 100
    },
    {
      "id": "atlas",
      "name": "ATLAS SkillTech University",
      "logo": "./logos/atlas.svg",
      "source": "https://atlasuniversity.edu.in/brand/",
      "width": 2000,
      "height": 898,
      "caption": "Mumbai"
    },
    {
      "id": "nailinit",
      "name": "nailinit",
      "logo": "./logos/nailinit.png",
      "source": "https://nailin.it/",
      "width": 724,
      "height": 152
    },
    {
      "id": "dot-media-mumbai",
      "name": "Dot Media",
      "logo": "./logos/dot-media-mumbai.png",
      "source": "https://www.dotmediabase.com/",
      "width": 2778,
      "height": 2778,
      "monochrome": true,
      "fit": "cover"
    },
    {
      "id": "sinhgad-academy",
      "name": "Sinhgad Academy of Engineering",
      "logo": "./logos/sinhgad-academy.png",
      "source": "https://cms.sinhgad.edu/sinhgad_engineering_institutes/saoe/about_us.aspx",
      "width": 180,
      "height": 121,
      "caption": "Sinhgad Academy of Engineering"
    },
    {
      "id": "pune-university",
      "name": "Savitribai Phule Pune University",
      "logo": "./logos/pune-university.png",
      "source": "https://bsw.unipune.ac.in/Logos.html",
      "width": 316,
      "height": 316,
      "caption": "Savitribai Phule Pune University"
    }
  ]
};
export function initTrainingHistory(root, history=verifiedTrainingHistory) {
  const locations=history.locations.filter(item=>item.name&&Number.isFinite(item.lat)&&Math.abs(item.lat)<=90&&Number.isFinite(item.lon)&&Math.abs(item.lon)<=180);
  const organisations=history.organisations.filter(item=>item.name&&item.logo&&item.source);
  const region=root.querySelector('#reach-evidence');
  region.hidden=locations.length===0;
  root.querySelector('#training-reach').classList.toggle('has-locations',locations.length>0);
  const list=root.querySelector('#learner-locations');
  list.replaceChildren(...locations.map(item=>{
    const li=document.createElement('li'),name=document.createElement('strong'),institutions=document.createElement('small');
    name.textContent=item.name;institutions.textContent=item.institutions.join(' · ');li.append(name,institutions);return li;
  }));
  const section=root.querySelector('#learner-organisations');
  section.hidden=organisations.length===0;
  const track=root.querySelector('#logo-track');
  track.style.setProperty('--ticker-duration',`${Math.max(32,organisations.length*3.5)}s`);
  if(organisations.length){
    const group=document.createElement('ul');group.className='logo-group';
    for(const item of organisations){
      const li=document.createElement('li'),img=document.createElement('img');
      img.src=item.logo;img.alt=item.name;img.width=item.width;img.height=item.height;img.loading='lazy';img.decoding='async';
      img.className=[item.monochrome?'logo-monochrome':'',item.fit==='cover'?'logo-cover':''].filter(Boolean).join(' ');
      if(item.scale)img.style.setProperty('--logo-scale',String(item.scale));
      li.append(img);
      if(item.caption){const caption=document.createElement('span');caption.className='logo-caption';caption.textContent=item.caption;li.append(caption);}
      group.append(li);
    }
    const duplicate=group.cloneNode(true);duplicate.setAttribute('aria-hidden','true');
    duplicate.querySelectorAll('img').forEach(img=>{img.alt='';});track.replaceChildren(group,duplicate);
  }else track.replaceChildren();
  return {locations};
}
