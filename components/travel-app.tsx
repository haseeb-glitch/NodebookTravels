'use client';
/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */
import React, {useEffect,useMemo,useState} from 'react';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {MapPin,Phone,Mail,Menu,X,ChevronDown,ChevronLeft,ChevronRight,ArrowRight,Clock3,Search,Plane,ShieldCheck,Heart,Star,Users,Compass,CalendarDays,CheckCircle2,SlidersHorizontal,Copy,Download,Headphones,Send} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Accordion,AccordionContent,AccordionItem,AccordionTrigger} from '@/components/ui/accordion';
import {destinations,international,trips,pkr,type Trip} from '@/lib/travel-data';
import {siteConfig} from '@/lib/site-config';

type Place = typeof destinations[number];
const destinationLink=(p:Place)=>`/location/${p.slug}`;
const tripLink=(t:Trip)=>`/tour/${t.slug}`;
const ALL_PLACES=[...destinations,...international];
const imageDescription:Record<string,string>={hunza:'Attabad Lake in Hunza, Pakistan',naran:'Lake Saif ul Malook in Naran, Pakistan',skardu:'Shangrila Lake near Skardu, Pakistan',shogran:'Siri Paye meadows near Shogran, Pakistan',kashmir:'Neelum Valley, Pakistan',swat:'Swat River near Kalam, Pakistan',passu:'Passu Cones in Hunza, Pakistan',islamabad:'Faisal Mosque in Islamabad, Pakistan',umrah:'The Kaaba in Makkah',dubai:'Dubai skyline',thailand:'Wat Arun in Bangkok, Thailand',malaysia:'Petronas Towers in Kuala Lumpur, Malaysia',turkey:'Hagia Sophia in Istanbul, Türkiye',baku:'Flame Towers and Caspian Waterfront in Baku, Azerbaijan',maldives:'Overwater villas and turquoise lagoon in Maldives'};
const imageAlt=(path:string)=>imageDescription[path.split('/').pop()?.replace('.jpg','')||'']||'Travel destination photograph';
const pick=(n:number,start:number,count:number)=>Array.from({length:Math.min(count,n)},(_,i)=>(start+i)%n);
function Brand(){return <Link href="/" className="brand" aria-label="Nodebook Travels home"><span className="brand-round"><span className="brand-symbol">N</span><small>travels</small></span><strong>Nodebook <em>Travels</em></strong></Link>}
function Heading({title,kicker,sub,showPlane=true}:{title:string,kicker?:string,sub?:string,showPlane?:boolean}){return <div className="company-heading-box">{kicker&&<span className="eyebrow">{kicker}</span>}<div className="company-title-wrapper"><h2 className="company-title">{title}{showPlane&&<PaperAirplaneDoodle className="company-plane-doodle" color="#0c2a72"/>}</h2></div>{sub&&<p className="company-subheading">{sub}</p>}</div>}
function TripCard({trip}:{trip:Trip}){return <article className="trip-card"><Link href={tripLink(trip)} className="card-photo"><img src={trip.image} alt={imageAlt(trip.image)} loading="lazy"/><span className="card-badge">{trip.days} Days / {trip.days-1} {trip.days-1===1?'Night':'Nights'}</span></Link><div className="trip-body"><div className="trip-destination"><MapPin size={13}/>{trip.destination}</div><Link href={tripLink(trip)} className="trip-title">{trip.title}</Link><div className="trip-meta"><span><Clock3 size={14}/> {trip.days} Days · {trip.days-1} Nights</span><span><Star size={13} fill="currentColor"/> Suggested</span></div><div className="trip-bottom"><span><small>Starts from / person*</small><strong>{pkr(trip.price)}</strong></span><Link href={tripLink(trip)} className="round-next" aria-label={`View ${trip.title}`}><ArrowRight size={18}/></Link></div></div></article>}
function PlaceCard({place}:{place:Place}){return <Link href={destinationLink(place)} className="place-card"><img src={place.image} alt={imageAlt(place.image)} loading="lazy"/><div className="place-card-gradient"/><div className="place-shade"><span className="place-region-pill">{place.region}</span><h3>{place.name}</h3><b className="place-cta">Explore Packages <ArrowRight size={15}/></b></div></Link>}
function Breadcrumb({items}:{items:{text:string,href?:string}[]}){return <nav aria-label="Breadcrumb" className="breadcrumb"><Link href="/">Home</Link>{items.map((it,i)=><React.Fragment key={i}><ChevronRight size={13}/>{it.href?<Link href={it.href}>{it.text}</Link>:<span>{it.text}</span>}</React.Fragment>)}</nav>}
function Hero({onSearch}:{onSearch:(s:string)=>void}){
  const [slide,setSlide]=useState(0);
  const [selected,setSelected]=useState('');
  const slides=[
    {image:'/images/hunza-hero.jpg',name:'Hunza Valley',location:'Hunza · Gilgit-Baltistan'},
    {image:'/images/fairy-meadows-hero.jpg',name:'Fairy Meadows',location:'Fairy Meadows & Nanga Parbat'},
    {image:'/images/skardu-hero.jpg',name:'Skardu Shangrila',location:'Skardu · Gilgit-Baltistan'}
  ];

  useEffect(()=>{
    const timer=setInterval(()=>{
      setSlide(curr=>(curr+1)%slides.length);
    },6000);
    return ()=>clearInterval(timer);
  },[slides.length]);

  return (
    <section className="hero" aria-label="Featured travel destinations">
      <div className="hero-slides" aria-live="polite">
        {slides.map((s,i)=>(
          <div
            key={i}
            className={`hero-slide ${slide===i?'hero-slide-active':''}`}
            style={{backgroundImage:`url('${s.image}')`}}
            role="img"
            aria-label={`${s.name} - ${s.location}`}
          />
        ))}
      </div>
      <div className="hero-overlay-top" aria-hidden="true"/>
      <div className="hero-overlay-bottom" aria-hidden="true"/>

      <button
        type="button"
        className="hero-chevron hero-chevron-left"
        onClick={()=>setSlide((slide+slides.length-1)%slides.length)}
        aria-label="Previous destination"
      >
        <ChevronLeft size={44} strokeWidth={2.4}/>
      </button>

      <button
        type="button"
        className="hero-chevron hero-chevron-right"
        onClick={()=>setSlide((slide+1)%slides.length)}
        aria-label="Next destination"
      >
        <ChevronRight size={44} strokeWidth={2.4}/>
      </button>

      <div className="hero-bottom-container">
        <form
          className="hero-search-bar"
          onSubmit={e=>{
            e.preventDefault();
            onSearch(selected);
          }}
        >
          <div className="hero-search-select-wrapper">
            <select
              className="hero-search-select"
              value={selected}
              onChange={e=>setSelected(e.target.value)}
              aria-label="What are you looking for?"
            >
              <option value="">What are you looking for?</option>
              {ALL_PLACES.map(p=>(
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="hero-select-chevron" size={19} strokeWidth={2.2}/>
          </div>
          <button className="hero-search-btn" type="submit">Search</button>
        </form>

        <div className="hero-dots" aria-label="Slide navigation">
          {slides.map((_,i)=>(
            <button
              key={i}
              type="button"
              className={`hero-dot ${slide===i?'hero-dot-active':''}`}
              onClick={()=>setSlide(i)}
              aria-label={`Slide ${i+1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
function HorizontalTrips({title,subtitle,items,isSoft}:{title:string,subtitle?:string,items:Trip[],isSoft?:boolean}){
  const [slideIndex, setSlideIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const updateCards = () => {
      const w = window.innerWidth;
      if (w <= 480) setCardsPerView(1);
      else if (w <= 768) setCardsPerView(2);
      else if (w <= 1024) setCardsPerView(3);
      else setCardsPerView(4);
    };
    updateCards();
    window.addEventListener('resize', updateCards);
    return () => window.removeEventListener('resize', updateCards);
  }, []);

  const maxIndex = Math.max(0, items.length - cardsPerView);

  const prevSlide = () => {
    setSlideIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
  };

  const nextSlide = () => {
    setSlideIndex(prev => (prev < maxIndex ? prev + 1 : 0));
  };

  const translatePercent = slideIndex * (100 / cardsPerView);

  return (
    <section className={`section featured-packages-section ${isSoft ? 'section-soft' : ''}`}>
      <div className="wrap">
        <div className="company-heading-box">
          <div className="company-title-wrapper">
            <h2 className="company-title">
              {title}
              <PaperAirplaneDoodle className="company-plane-doodle" color="#0c2a72"/>
            </h2>
          </div>
          {subtitle && <p className="company-subheading">{subtitle}</p>}
        </div>

        <div className="company-slider-container">
          <button
            type="button"
            className="company-arrow-btn prev"
            onClick={prevSlide}
            aria-label={`Previous ${title}`}
          >
            <ChevronLeft size={38} strokeWidth={2.6}/>
          </button>

          <div className="company-slider-viewport">
            <div
              className="company-slider-track"
              style={{ transform: `translateX(-${translatePercent}%)` }}
            >
              {items.map(trip => (
                <div key={trip.slug} className="company-card-wrapper" style={{ flex: `0 0 ${100 / cardsPerView}%` }}>
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="company-arrow-btn next"
            onClick={nextSlide}
            aria-label={`Next ${title}`}
          >
            <ChevronRight size={38} strokeWidth={2.6}/>
          </button>
        </div>
      </div>
    </section>
  );
}
const pakistanFeaturedPackages = [
  { title: 'Hunza Tour Packages', slug: 'hunza', image: '/images/hunza.jpg' },
  { title: 'Skardu Tour Packages', slug: 'skardu', image: '/images/skardu.jpg' },
  { title: 'Fairy Meadows Tour Packages', slug: 'fairy-meadows', image: '/images/fairy-meadows-hero.jpg' },
  { title: 'Swat Valley Tour Packages', slug: 'swat', image: '/images/swat.jpg' },
  { title: 'Neelum Valley Tour Packages', slug: 'kashmir', image: '/images/kashmir.jpg' },
  { title: 'Naran & Kaghan Tour Packages', slug: 'naran-kaghan', image: '/images/naran.jpg' },
  { title: 'Shogran Tour Packages', slug: 'shogran', image: '/images/shogran.jpg' },
  { title: 'Kumrat Valley Tour Packages', slug: 'kumrat', image: '/images/passu.jpg' },
];

function BestCompanySection(){
  const [slideIndex, setSlideIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const updateCards = () => {
      const w = window.innerWidth;
      if (w <= 480) setCardsPerView(1);
      else if (w <= 768) setCardsPerView(2);
      else if (w <= 1024) setCardsPerView(3);
      else setCardsPerView(4);
    };
    updateCards();
    window.addEventListener('resize', updateCards);
    return () => window.removeEventListener('resize', updateCards);
  }, []);

  const maxIndex = Math.max(0, pakistanFeaturedPackages.length - cardsPerView);

  const prevSlide = () => {
    setSlideIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
  };

  const nextSlide = () => {
    setSlideIndex(prev => (prev < maxIndex ? prev + 1 : 0));
  };

  const translatePercent = slideIndex * (100 / cardsPerView);

  return (
    <section className="section wrap featured-packages-section">
      <div className="company-heading-box">
        <div className="company-title-wrapper">
          <h2 className="company-title">
            Best Tour and Travel Company in Pakistan
            <PaperAirplaneDoodle className="company-plane-doodle" color="#0c2a72"/>
          </h2>
        </div>
        <p className="company-subheading">40000+ Tourists have already travelled with us!</p>
      </div>

      <div className="company-slider-container">
        <button
          type="button"
          className="company-arrow-btn prev"
          onClick={prevSlide}
          aria-label="Previous tour packages"
        >
          <ChevronLeft size={38} strokeWidth={2.6}/>
        </button>

        <div className="company-slider-viewport">
          <div
            className="company-slider-track"
            style={{ transform: `translateX(-${translatePercent}%)` }}
          >
            {pakistanFeaturedPackages.map(pkg => (
              <div key={pkg.slug} className="company-card-wrapper" style={{ flex: `0 0 ${100 / cardsPerView}%` }}>
                <Link href={`/tour?destination=${pkg.slug}`} className="company-package-card">
                  <div className="company-card-media">
                    <img src={pkg.image} alt={pkg.title} loading="lazy" />
                    <div className="company-card-gradient"/>
                    <div className="company-card-label">
                      <h3>{pkg.title}</h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="company-arrow-btn next"
          onClick={nextSlide}
          aria-label="Next tour packages"
        >
          <ChevronRight size={38} strokeWidth={2.6}/>
        </button>
      </div>
    </section>
  );
}

const countryPackagesList = [
  { title: 'Saudi Arabia Tour Packages', slug: 'umrah', image: '/images/umrah.jpg' },
  { title: 'Baku Azerbaijan Packages', slug: 'baku', image: '/images/baku.jpg' },
  { title: 'Maldives Tour Packages', slug: 'maldives', image: '/images/maldives.jpg' },
  { title: 'Thailand Tour Packages', slug: 'thailand', image: '/images/thailand.jpg' },
  { title: 'Malaysia Tour Packages', slug: 'malaysia', image: '/images/malaysia.jpg' },
  { title: 'Dubai Tour Packages', slug: 'dubai', image: '/images/dubai.jpg' },
  { title: 'Turkey Tour Packages', slug: 'turkey', image: '/images/turkey.jpg' },
];

function CountryPackagesSection(){
  const [slideIndex, setSlideIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const updateCards = () => {
      const w = window.innerWidth;
      if (w <= 480) setCardsPerView(1);
      else if (w <= 768) setCardsPerView(2);
      else if (w <= 1024) setCardsPerView(3);
      else setCardsPerView(4);
    };
    updateCards();
    window.addEventListener('resize', updateCards);
    return () => window.removeEventListener('resize', updateCards);
  }, []);

  const maxIndex = Math.max(0, countryPackagesList.length - cardsPerView);

  const prevSlide = () => {
    setSlideIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
  };

  const nextSlide = () => {
    setSlideIndex(prev => (prev < maxIndex ? prev + 1 : 0));
  };

  const translatePercent = slideIndex * (100 / cardsPerView);

  return (
    <section className="section section-soft featured-packages-section">
      <div className="wrap">
        <div className="company-heading-box">
          <div className="company-title-wrapper">
            <h2 className="company-title">
              Explore Packages by Country
              <PaperAirplaneDoodle className="company-plane-doodle" color="#0c2a72"/>
            </h2>
          </div>
          <p className="company-subheading">Find the perfect getaway in your favorite country</p>
        </div>

        <div className="company-slider-container">
          <button
            type="button"
            className="company-arrow-btn prev"
            onClick={prevSlide}
            aria-label="Previous country packages"
          >
            <ChevronLeft size={38} strokeWidth={2.6}/>
          </button>

          <div className="company-slider-viewport">
            <div
              className="company-slider-track"
              style={{ transform: `translateX(-${translatePercent}%)` }}
            >
              {countryPackagesList.map(pkg => (
                <div key={pkg.slug} className="company-card-wrapper" style={{ flex: `0 0 ${100 / cardsPerView}%` }}>
                  <Link href={`/tour?destination=${pkg.slug}`} className="company-package-card">
                    <div className="company-card-media">
                      <img src={pkg.image} alt={pkg.title} loading="lazy" />
                      <div className="company-card-gradient"/>
                      <div className="company-card-label">
                        <h3>{pkg.title}</h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="company-arrow-btn next"
            onClick={nextSlide}
            aria-label="Next country packages"
          >
            <ChevronRight size={38} strokeWidth={2.6}/>
          </button>
        </div>
      </div>
    </section>
  );
}

function Home({goSearch}:{goSearch:(s:string)=>void}){
  return (
    <main>
      <Hero onSearch={goSearch}/>
      <BestCompanySection/>
      <CountryPackagesSection/>
      <HorizontalTrips
        title="Featured Holiday Packages"
        subtitle="Suggested journeys and handcrafted holiday plans across Pakistan."
        items={trips.filter(t => t.region === 'Domestic')}
      />
      <section className="promo-band" style={{backgroundImage:"linear-gradient(90deg,rgba(4,26,66,.93),rgba(4,26,66,.65)),url('/images/passu.jpg')"}}>
        <div className="wrap promo-band-content">
          <div className="promo-text-col">
            <span className="eyebrow light">✦ TAILORED TRAVEL EXPERIENCES</span>
            <h2>Let’s explore your dream destination.</h2>
            <p>Tell us where you want to go and our travel specialists will curate the perfect itinerary tailored to your schedule, preferences, and budget.</p>
            <div className="promo-actions">
              <Link href="/contact" className="btn btn-turquoise">Plan your trip <ArrowRight size={17}/></Link>
              <a href="tel:+923252551585" className="btn btn-promo-call"><Phone size={16} fill="currentColor"/> Call +92 325 2551585</a>
            </div>
          </div>
          <div className="promo-stats-grid">
            <div className="promo-stat-box">
              <span className="promo-stat-num">40,000+</span>
              <span className="promo-stat-lbl">Happy Tourists</span>
            </div>
            <div className="promo-stat-box">
              <span className="promo-stat-num">100%</span>
              <span className="promo-stat-lbl">Customized Trips</span>
            </div>
            <div className="promo-stat-box">
              <span className="promo-stat-num">24/7</span>
              <span className="promo-stat-lbl">Local Assistance</span>
            </div>
            <div className="promo-stat-box">
              <span className="promo-stat-num">50+</span>
              <span className="promo-stat-lbl">Handcrafted Tours</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <Heading title="Explore destinations by theme" sub="Choose the kind of journey you have in mind."/>
        <div className="theme-grid">
          {[
            { title: 'Mountain Escapes', count: 'Hunza & Skardu Peaks', slug: 'hunza', img: '/images/hunza.jpg' },
            { title: 'Lakes & Valleys', count: 'Naran, Neelum & Kaghan', slug: 'naran-kaghan', img: '/images/naran.jpg' },
            { title: 'Heritage & Culture', count: 'Swat, Lahore & Islamabad', slug: 'swat', img: '/images/swat.jpg' },
            { title: 'Across Borders', count: 'Baku, Maldives & Dubai', slug: 'dubai', img: '/images/dubai.jpg' }
          ].map(item => (
            <Link href={`/location/${item.slug}`} className="theme-card" key={item.slug}>
              <img src={item.img} alt={item.title}/>
              <div className="theme-card-overlay"/>
              <div className="theme-card-content">
                <span className="theme-card-count">{item.count}</span>
                <div className="theme-card-footer">
                  <h3>{item.title}</h3>
                  <span className="theme-card-arrow"><ArrowRight size={17}/></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <HorizontalTrips
        title="Customizable Tour Ideas"
        subtitle="Handcrafted private tours flexible to your dates, group size, and preferred pacing."
        items={trips.filter(t => t.region === 'Domestic').slice(4)}
        isSoft={true}
      />
      <section className="section">
        <div className="wrap">
          <Heading title="Places you can explore with Nodebook Travels" sub="From the green valleys of Kashmir to the mighty peaks of Gilgit-Baltistan."/>
          <div className="place-grid">
            {destinations.slice(0,10).map(p=><PlaceCard key={p.slug} place={p}/>)}
          </div>
          <div className="center">
            <Link href="/places" className="btn btn-outline">View all places <ArrowRight size={17}/></Link>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="wrap">
          <Heading title="Why travel with us?" sub="Clear plans, useful details, and more freedom to make the trip your own."/>
          <div className="benefit-grid">
            <div className="benefit-card">
              <div className="benefit-icon-box"><Compass size={30}/></div>
              <h3>Thoughtful Itineraries</h3>
              <p>Routes designed around time for the places that truly matter, avoiding rushed schedules.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon-box"><Users size={30}/></div>
              <h3>Trips for Every Group</h3>
              <p>Handcrafted travel plans tailored for families, friends, couples, and solo travelers.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon-box"><ShieldCheck size={30}/></div>
              <h3>Transparent Details</h3>
              <p>Clear durations, inclusions, and transparent pricing with zero surprise costs.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon-box"><Headphones size={30}/></div>
              <h3>24/7 Dedicated Support</h3>
              <p>Continuous trip planning assistance and dedicated on-ground coordination throughout your stay.</p>
            </div>
          </div>
        </div>
      </section>
      <HorizontalTrips
        title="International Holiday Packages"
        subtitle="Unforgettable journeys across Saudi Arabia, Baku, Maldives, Thailand, Malaysia, Dubai, and Türkiye."
        items={trips.filter(t => t.region === 'International')}
      />
    </main>
  );
}
function TourListing({initialCategory}:{initialCategory?:string}){const router=useRouter();const params=useSearchParams();const [category,setCategory]=useState(initialCategory||params.get('destination')||'all');const [term,setTerm]=useState(params.get('q')||'');const [sort,setSort]=useState('popular');const [budget,setBudget]=useState('all');const [length,setLength]=useState('all');const [page,setPage]=useState(1);const [mobileFilters,setMobileFilters]=useState(false);useEffect(()=>{setCategory(initialCategory||params.get('destination')||'all');setTerm(params.get('q')||'');setPage(1)},[initialCategory,params]);const filtered=useMemo(()=>{const a=trips.filter(t=>(category==='all'||category==='domestic'&&t.region==='Domestic'||category==='international'&&t.region==='International'||(ALL_PLACES.find(p=>p.slug===category)?.name===t.destination))&&(!term||`${t.title} ${t.destination} ${t.highlights.join(' ')}`.toLowerCase().includes(term.toLowerCase()))&&(budget==='all'||t.price<Number(budget))&&(length==='all'||(length==='short'?t.days<=3:length==='medium'?t.days>=4&&t.days<=6:t.days>=7)));if(sort==='low')a.sort((a,b)=>a.price-b.price);else if(sort==='high')a.sort((a,b)=>b.price-a.price);else if(sort==='duration')a.sort((a,b)=>a.days-b.days);return a},[category,term,sort,budget,length]);const count=9;const pages=Math.max(1,Math.ceil(filtered.length/count));const current=Math.min(page,pages);const filterUI=<><h3>Filter packages <button className="filter-reset" onClick={()=>{setCategory('all');setBudget('all');setLength('all');setTerm('');setPage(1);router.replace('/tour')}}>Reset</button></h3><label className="field-label">Destination</label><select value={category} onChange={e=>{setCategory(e.target.value);setPage(1)}}><option value="all">All destinations</option><option value="domestic">Pakistan</option><option value="international">International</option>{ALL_PLACES.map(p=><option key={p.slug} value={p.slug}>{p.name}</option>)}</select><label className="field-label">Budget per person</label><select value={budget} onChange={e=>{setBudget(e.target.value);setPage(1)}}><option value="all">Any budget</option><option value="20000">Under PKR 20,000</option><option value="40000">Under PKR 40,000</option><option value="200000">Under PKR 200,000</option></select><label className="field-label">Duration</label><select value={length} onChange={e=>{setLength(e.target.value);setPage(1)}}><option value="all">Any duration</option><option value="short">1–3 days</option><option value="medium">4–6 days</option><option value="long">7+ days</option></select><div className="filter-help"><Headphones size={24}/><strong>Need help planning?</strong><p>Send your dates, group size and preferred destination.</p><Link href="/contact" className="btn btn-turquoise">Enquire now</Link></div></>;return <main><PageBanner title="Tour Packages" subtitle="Find a journey that fits your plans." image="/images/hunza.jpg"/><div className="wrap"><Breadcrumb items={[{text:'Tour Packages'}]}/><div className="listing-layout"><aside className={`filters ${mobileFilters?'show':''}`}>{filterUI}</aside><div><div className="listing-toolbar"><div><h2>{filtered.length} holiday packages</h2><p>Showing {filtered.length?((current-1)*count+1):0}–{Math.min(current*count,filtered.length)} of {filtered.length} packages</p></div><div className="toolbar-actions"><button className="mobile-filter" onClick={()=>setMobileFilters(!mobileFilters)}><SlidersHorizontal size={18}/> Filters</button><label>Sort by <select value={sort} onChange={e=>setSort(e.target.value)}><option value="popular">Popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="duration">Shortest first</option></select></label></div></div><form className="listing-search" onSubmit={e=>e.preventDefault()}><Search size={18}/><input placeholder="Search tours or destinations" aria-label="Search tours or destinations" value={term} onChange={e=>{setTerm(e.target.value);setPage(1)}}/>{term&&<button type="button" onClick={()=>setTerm('')} aria-label="Clear search"><X size={18}/></button>}</form>{filtered.length?<div className="trip-grid listing-grid">{filtered.slice((current-1)*count,current*count).map(t=><TripCard key={t.slug} trip={t}/>)}</div>:<div className="empty"><Search size={38}/><h3>No matching packages</h3><p>Try changing the destination, duration or budget.</p><button className="btn btn-blue" onClick={()=>{setCategory('all');setBudget('all');setLength('all');setTerm('')}}>Clear filters</button></div>}{pages>1&&<nav className="pagination" aria-label="Tour pages"><button disabled={current===1} onClick={()=>{setPage(current-1);scrollTo({top:260,behavior:'smooth'})}}><ChevronLeft/></button>{Array.from({length:pages},(_,i)=><button key={i} className={current===i+1?'active':''} onClick={()=>{setPage(i+1);scrollTo({top:260,behavior:'smooth'})}}>{i+1}</button>)}<button disabled={current===pages} onClick={()=>{setPage(current+1);scrollTo({top:260,behavior:'smooth'})}}><ChevronRight/></button></nav>}<p className="rate-note">*Indicative starting rates per person in PKR. Dates, hotel category, transport, flights and availability affect the final quote.</p></div></div></div></main>}
function PageBanner({title,subtitle,image}:{title:string,subtitle?:string,image:string}){return <section className="page-banner" style={{backgroundImage:`linear-gradient(90deg,rgba(7,29,67,.86),rgba(7,29,67,.25)),url('${image}')`}}><div className="wrap"><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div></section>}
function Places(){const [query,setQuery]=useState('');const [tab,setTab]=useState<'pakistan'|'international'>('pakistan');const list=(tab==='pakistan'?destinations:international).filter(p=>`${p.name} ${p.region}`.toLowerCase().includes(query.toLowerCase()));return <main><PageBanner title="Places to Visit" subtitle="Explore Pakistan and beyond, one place at a time." image="/images/naran.jpg"/><div className="wrap"><Breadcrumb items={[{text:'Places to Visit'}]}/><section className="section"><Heading title="Where would you like to go?" sub="Browse destinations and discover their available tours."/><div className="places-tools"><div className="segmented"><button className={tab==='pakistan'?'active':''} onClick={()=>setTab('pakistan')}>Pakistan</button><button className={tab==='international'?'active':''} onClick={()=>setTab('international')}>International</button></div><div className="places-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a place" aria-label="Find a place"/></div></div>{list.length?<div className="place-grid all-places">{list.map(p=><PlaceCard key={p.slug} place={p}/>)}</div>:<div className="empty">No destinations match your search.</div>}</section></div></main>}
function Destination({slug}:{slug:string}){const place=ALL_PLACES.find(p=>p.slug===slug);if(!place)return <NotFound/>;const related=trips.filter(t=>t.destination===place.name);return <main><PageBanner title={place.name} subtitle={place.blurb} image={place.image}/><div className="wrap"><Breadcrumb items={[{text:'Places to Visit',href:'/places'},{text:place.name}]}/><section className="section dest-intro"><div><span className="eyebrow"><MapPin size={14}/> {place.region}</span><h2>Discover {place.name}</h2><p>{place.blurb} Explore our suggested packages, compare durations and choose the route that works for your group.</p><Link href="/contact" className="btn btn-blue">Plan a custom trip <ArrowRight size={16}/></Link></div><img src={place.image} alt={imageAlt(place.image)}/></section><section className="section"><Heading title={`${place.name} tour packages`} sub={`${related.length} trip ${related.length===1?'idea':'ideas'} to get you started.`}/><div className="trip-grid">{related.map(t=><TripCard key={t.slug} trip={t}/>)}</div></section><section className="section compact"><Heading title="Explore more destinations"/><div className="place-grid">{ALL_PLACES.filter(p=>p.slug!==slug).slice(0,5).map(p=><PlaceCard key={p.slug} place={p}/>)}</div></section></div></main>}
function InquiryForm({trip}:{trip?:Trip}){const [sent,setSent]=useState(false);const [draft,setDraft]=useState('');const [copied,setCopied]=useState(false);function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const form=e.currentTarget;const data=new FormData(form);const msg=`Nodebook Travels enquiry\nPackage: ${trip?.title||data.get('destination')||'Custom journey'}\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\nTravel date: ${data.get('date')||'Flexible'}\nTravellers: ${data.get('travellers')||'Not specified'}\nMessage: ${data.get('message')||'—'}`;setDraft(msg);try{const saved=JSON.parse(localStorage.getItem('nodebook-enquiries')||'[]');saved.push({message:msg,createdAt:new Date().toISOString()});localStorage.setItem('nodebook-enquiries',JSON.stringify(saved))}catch{}setSent(true)}if(sent)return <div className="form-confirm"><CheckCircle2 size={46}/><h3>Enquiry prepared</h3><p>Your trip details are saved in this browser. Copy the request to share it with the travel team. No message has been sent automatically.</p><div className="confirm-actions"><button className="btn btn-blue" type="button" onClick={async()=>{await navigator.clipboard.writeText(draft);setCopied(true)}}><Copy size={16}/>{copied?'Copied':'Copy enquiry'}</button>{siteConfig.contactEmail&&<a className="btn btn-turquoise" href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent('Travel enquiry – Nodebook Travels')}&body=${encodeURIComponent(draft)}`}>Email enquiry</a>}<button className="btn btn-outline" type="button" onClick={()=>{const blob=new Blob([draft],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nodebook-enquiry.txt';a.click();URL.revokeObjectURL(a.href)}}><Download size={16}/>Download</button></div><button type="button" className="text-button" onClick={()=>{setSent(false);setCopied(false)}}>Prepare another enquiry</button></div>;return <form className="enquiry-form" onSubmit={submit}><div className="form-pair"><label>Name *<input name="name" required minLength={2} placeholder="Your name"/></label><label>Email *<input name="email" required type="email" placeholder="Your email"/></label></div><div className="form-pair"><label>Phone *<input name="phone" required type="tel" pattern="[+0-9() .-]{7,20}" placeholder="Your phone number"/></label><label>Travel date<input name="date" type="date" min={new Date().toISOString().slice(0,10)}/></label></div><div className="form-pair"><label>Travellers<input name="travellers" type="number" min="1" max="50" defaultValue="2"/></label>{!trip&&<label>Destination<select name="destination" defaultValue=""><option value="">Choose a destination</option>{ALL_PLACES.map(p=><option key={p.slug}>{p.name}</option>)}</select></label>}</div><label>Tell us about your trip *<textarea name="message" required minLength={8} rows={4} placeholder="Dates, departure city, preferred hotel and anything else we should know"/></label><button type="submit" className="btn btn-turquoise">Prepare enquiry <Send size={16}/></button><small className="form-disclosure">This creates a copyable request on your device. Delivery to an agency requires a contact channel to be configured.</small></form>}
function TripDetail({slug}:{slug:string}){const trip=trips.find(t=>t.slug===slug);const related=trip?trips.filter(t=>t.slug!==slug&&(t.destination===trip.destination||t.region===trip.region)).slice(0,4):[];const [saved,setSaved]=useState(false);useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem('nodebook-saved')||'[]').includes(slug))}catch{}},[slug]);if(!trip)return <NotFound/>;function save(){const list:string[]=JSON.parse(localStorage.getItem('nodebook-saved')||'[]');const next=saved?list.filter(x=>x!==slug):[...list,slug];localStorage.setItem('nodebook-saved',JSON.stringify(next));setSaved(!saved)}return <main><PageBanner title={trip.title} subtitle={`${trip.days} Days / ${trip.days-1} {trip.days-1===1?'Night':'Nights'} · ${trip.destination}`} image={trip.image}/><div className="wrap"><Breadcrumb items={[{text:'Tour Packages',href:'/tour'},{text:trip.title}]}/><div className="detail-layout"><article className="detail-main"><div className="detail-title-row"><div><span className="eyebrow"><MapPin size={14}/>{trip.destination}</span><h1>{trip.title}</h1><p>{trip.summary}</p></div><button className={`save-button ${saved?'saved':''}`} onClick={save} aria-label={saved?'Remove saved tour':'Save tour'}><Heart fill={saved?'currentColor':'none'} size={20}/>{saved?'Saved':'Save'}</button></div><img className="detail-photo" src={trip.image} alt={imageAlt(trip.image)}/><div className="detail-facts"><span><Clock3/> <b>{trip.days} Days</b><small>{trip.days-1} {trip.days-1===1?'Night':'Nights'}</small></span><span><MapPin/> <b>{trip.destination}</b><small>Destination</small></span><span><Users/> <b>Flexible</b><small>Group size</small></span><span><CalendarDays/> <b>Your dates</b><small>On enquiry</small></span></div><div className="detail-tabs"><Tabs defaultValue="itinerary"><TabsList className="detail-tab-list"><TabsTrigger value="itinerary">Itinerary</TabsTrigger><TabsTrigger value="details">Tour Details</TabsTrigger><TabsTrigger value="information">Information</TabsTrigger><TabsTrigger value="know">Need to Know</TabsTrigger><TabsTrigger value="policy">Policy & Terms</TabsTrigger></TabsList><TabsContent value="itinerary"><h2>Itinerary (day wise)</h2><p>A suggested route; stops and timings may change with weather, road conditions and your dates.</p><Accordion type="single" collapsible defaultValue="day-0">{Array.from({length:trip.days},(_,i)=>{const place=trip.itinerary[Math.min(Math.floor(i*trip.itinerary.length/trip.days),trip.itinerary.length-1)];return <AccordionItem value={`day-${i}`} key={i}><AccordionTrigger>Day {i+1} – {i===0?'Arrival & departure from your pickup point':i===trip.days-1?'Return journey':`Explore ${place}`}</AccordionTrigger><AccordionContent>{i===0?`Meet your travel group and begin the journey towards ${trip.destination}. Check in and take time to settle in.`:i===trip.days-1?'After breakfast, check out and begin the return journey. Arrival times depend on traffic, weather and your departure point.':`Enjoy time around ${place}, with scenic stops and free time as conditions allow. Overnight accommodation follows your final confirmed plan.`}</AccordionContent></AccordionItem>})}</Accordion></TabsContent><TabsContent value="details"><h2>Tour highlights</h2><ul className="check-list">{trip.highlights.map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}</ul><p><strong>Suggested route:</strong> {trip.itinerary.join(' → ')}.</p><p>Hotels, meals, vehicle type, flights, visas and any optional activities are selected with your final quotation.</p></TabsContent><TabsContent value="information"><h2>Tour information</h2><p><strong>Duration:</strong> {trip.days} days / {trip.days-1} nights</p><p><strong>Starting price:</strong> {pkr(trip.price)} per person, indicative only.</p><p><strong>Departure:</strong> Tell us your city and travel dates when you enquire.</p><p><strong>Availability:</strong> Subject to hotels, transport and seasonal access.</p></TabsContent><TabsContent value="know"><h2>Before you travel</h2><ul className="check-list"><li><CheckCircle2 size={17}/>Carry valid ID or passport as required for the trip.</li><li><CheckCircle2 size={17}/>Check local weather, road and entry requirements near departure.</li><li><CheckCircle2 size={17}/>Pack for changing temperatures and comfortable walking.</li>{trip.region==='International'&&<li><CheckCircle2 size={17}/>Visa eligibility, flights and travel insurance require confirmation.</li>}</ul></TabsContent><TabsContent value="policy"><h2>Policy & terms</h2><p>These packages are example itineraries and indicative starting prices. A booking is only created after a dated quotation, inclusions, cancellation terms and payment instructions are agreed with the operator.</p><p>Changes in weather, road access, supplier availability and entry rules can change a route. Ask for the current terms before paying.</p></TabsContent></Tabs></div></article><aside className="detail-sidebar"><div className="price-panel"><small>Starts from / person*</small><strong>{pkr(trip.price)}</strong><span>{trip.days} Days / {trip.days-1} {trip.days-1===1?'Night':'Nights'}</span><Link href="#enquire" className="btn btn-turquoise">Enquire about this tour <ArrowRight size={16}/></Link><p>*Final inclusions and price confirmed on enquiry.</p></div><div className="why-panel"><h3>Trip highlights</h3>{trip.highlights.map(h=><p key={h}><CheckCircle2 size={16}/>{h}</p>)}</div><div id="enquire" className="sidebar-form"><h3>Ask about this tour</h3><InquiryForm trip={trip}/></div></aside></div>{related.length>0&&<section className="section"><Heading title="You may also like"/><div className="trip-grid">{related.map(t=><TripCard key={t.slug} trip={t}/>)}</div></section>}</div></main>}
function Contact(){return <main><PageBanner title="Contact Us" subtitle="Tell us where you want to go. Let’s plan the details together." image="/images/skardu.jpg"/><div className="wrap"><Breadcrumb items={[{text:'Contact Us'}]}/><section className="section contact-grid"><div className="contact-info"><Brand/><h2>Nodebook Travels</h2><p>Pakistan adventures and international journeys, planned around the way you travel.</p><div className="contact-line"><MapPin/> <span>{siteConfig.businessAddress||'Based in Pakistan · Trips across Pakistan and abroad'}</span></div><div className="contact-line"><Mail/> <span>{siteConfig.contactEmail||'Use the enquiry form to prepare your request. Add official contact details before launch.'}</span></div><div className="contact-line"><Headphones/> <span>Share your preferred dates, group size and departure city for an accurate quotation.</span></div><div className="contact-panorama"><img src="/images/kashmir.jpg" alt="Neelum Valley, Pakistan"/></div></div><div className="contact-form-panel"><span className="eyebrow">LET’S TALK TRAVEL</span><h2>Send us your trip details</h2><p>Fill in your plans and prepare a copyable enquiry.</p><InquiryForm/></div></section></div></main>}
function About(){return <main><PageBanner title="About Nodebook Travels" subtitle="Journeys with room for discovery." image="/images/hunza.jpg"/><div className="wrap"><Breadcrumb items={[{text:'About Us'}]}/><section className="section prose-page"><Heading title="Travel the way you want"/><p>Nodebook Travels is a travel site showcasing trip ideas in Pakistan and selected international destinations. Explore a destination, compare suggested packages and prepare a tailored enquiry around your dates and budget.</p><p>Each itinerary and starting rate is a planning guide. Ask for a final quote with confirmed inclusions before booking.</p><Link href="/tour" className="btn btn-blue">Explore tours <ArrowRight size={16}/></Link></section></div></main>}
function Policy({kind}:{kind:string}){const names:{[k:string]:string}={'terms':'Terms & Conditions','privacy':'Privacy Policy','cancellations':'Refunds & Cancellations','disclaimer':'Disclaimer'};const title=names[kind]||'Information';return <main><PageBanner title={title} image="/images/passu.jpg"/><div className="wrap"><Breadcrumb items={[{text:title}]}/><section className="section prose-page"><h2>{title}</h2><p>Package itineraries, prices and availability on this site are illustrative starting points. Confirm a written quotation with the travel provider before committing to any booking or payment.</p>{kind==='cancellations'?<p>Cancellation and refund rules depend on the final suppliers, departure dates and purchased services. Ask for the applicable written terms with your quotation.</p>:kind==='privacy'?<p>Enquiries, newsletter preferences, a local traveller profile and saved tours are stored in this browser only. This demo does not transmit your data to a server.</p>:<p>Routes, accommodation, meals, flights, visas, transport and weather-dependent activities must be reviewed and agreed with the provider. No payment facility is provided here.</p>}<Link href="/contact" className="btn btn-blue">Prepare an enquiry</Link></section></div></main>}
function NotFound(){return <main className="wrap not-found"><h1>Page not found</h1><p>That destination or package is not in our collection.</p><Link href="/" className="btn btn-blue">Back to home</Link></main>}
function Footer(){
  const [email,setEmail]=useState('');
  const [joined,setJoined]=useState(false);

  return (
    <footer className="footer">
      {/* Decorative Globe (left) & Air Balloons (right) */}
      <img
        src="/images/globe.svg"
        alt=""
        className="footer-deco-globe"
        loading="lazy"
        aria-hidden="true"
      />
      <img
        src="/images/balloon.svg"
        alt=""
        className="footer-deco-balloon"
        loading="lazy"
        aria-hidden="true"
      />

      <div className="wrap footer-main-content">
        <div className="footer-grid">
          {/* Column 1: About & Brand */}
          <div className="footer-col-about">
            <div className="footer-brand-wrap">
              <Brand/>
            </div>
            <p className="footer-about-text">
              Nodebook Travels is a leading tour and travel company dedicated to creating customized holiday experiences across Pakistan and international destinations. Whether you&apos;re planning a honeymoon, family vacation, group tour, corporate trip, or adventure getaway, we offer thoughtfully designed travel packages to destinations including Hunza, Skardu, Fairy Meadows, Naran Kaghan, Swat, Azad Kashmir, Dubai, Baku, Maldives, Thailand, and many more. Our commitment to personalized service, transparent pricing, carefully selected accommodations, and end-to-end travel assistance ensures a seamless, memorable, and hassle-free travel experience for every guest.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-btn"><FacebookIcon/></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-btn"><InstagramIcon/></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-btn"><YoutubeIcon/></a>
            </div>
          </div>

          {/* Column 2: Need Help */}
          <div className="footer-col">
            <h4 className="footer-col-title">NEED HELP?</h4>
            <div className="footer-contact-items">
              <p>
                <strong>Call Us:</strong> <a href="tel:+923252551585">+92 325 2551585</a>
              </p>
              <p>
                <strong>Email for Us:</strong> <a href="mailto:contact@nodebook.com">contact@nodebook.com</a>
              </p>
            </div>
          </div>

          {/* Column 3: Important Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">IMPORTANT LINKS</h4>
            <div className="footer-nav-links">
              <Link href="/">Home</Link>
              <Link href="/page/about-us">About Us</Link>
              <Link href="/tour">Tour Packages</Link>
              <Link href="/places">Places to Visit</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/page/terms">Terms & Conditions</Link>
              <Link href="/page/cancellations">Refunds & Cancellations</Link>
              <Link href="/page/privacy">Privacy Policy</Link>
              <Link href="/page/disclaimer">Disclaimer</Link>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col">
            <h4 className="footer-col-title newsletter-heading">Keep travelling all year round!</h4>
            <p className="footer-newsletter-desc">Subscribe to our newsletter to find travel inspiration in your inbox.</p>
            {joined ? (
              <p className="footer-subscribe-success">
                <CheckCircle2 size={18}/> Thank you for subscribing!
              </p>
            ) : (
              <form
                className="footer-subscribe-form"
                onSubmit={(e)=>{
                  e.preventDefault();
                  localStorage.setItem('nodebook-newsletter',email);
                  setJoined(true);
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                  placeholder="Enter your email*"
                  aria-label="Enter your email"
                />
                <button type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="footer-divider wrap"/>
      <div className="wrap footer-bottom-row">
        <p className="footer-copyright">© 2026 Nodebook Travels. All Right Reserved.</p>
      </div>

      {/* Landmarks Panorama Strip */}
      <div className="footer-landmarks-strip">
        <img
          src="/images/footer-landmarks.png"
          alt="Famous Travel Monuments and Landmarks"
          className="footer-landmarks-img"
          loading="lazy"
          width={1400}
          height={122}
        />
      </div>
    </footer>
  );
}
function Credits(){return <main><PageBanner title="Photo Credits" image="/images/hunza.jpg"/><div className="wrap"><Breadcrumb items={[{text:'Photo Credits'}]}/><section className="section prose-page"><h2>Destination photography</h2><p>Photos are adapted and resized for this travel site. Original sources and applicable licenses are listed in the project’s IMAGE_CREDITS.md file.</p><a href="/IMAGE_CREDITS.md" className="btn btn-blue" target="_blank" rel="noreferrer">View full credits <ArrowRight size={16}/></a></section></div></main>}
function HeaderMailIcon({className}:{className?:string}){return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>}
function HeaderPinIcon({className}:{className?:string}){return <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>}
function FacebookIcon({className}:{className?:string}){return <svg className={className} width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.002C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>}
function InstagramIcon({className}:{className?:string}){return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>}
function YoutubeIcon({className}:{className?:string}){return <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M21.582 6.186a2.506 2.506 0 0 0-1.764-1.77C18.254 4 12 4 12 4s-6.254 0-7.818.416a2.506 2.506 0 0 0-1.764 1.77A26.06 26.06 0 0 0 2 12a26.06 26.06 0 0 0 .418 5.814 2.506 2.506 0 0 0 1.764 1.77C5.746 20 12 20 12 20s6.254 0 7.818-.416a2.506 2.506 0 0 0 1.764-1.77A26.06 26.06 0 0 0 22 12a26.06 26.06 0 0 0-.418-5.814zM10 15.5V8.5l6 3.5-6 3.5z"/></svg>}
function UserPlusIcon({className}:{className?:string}){return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>}
function UserIcon({className}:{className?:string}){return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
function PaperAirplaneDoodle({className,color}:{className?:string,color?:string}){
  const c = color || '#ffffff';
  const trail = color ? color : 'rgba(255,255,255,0.7)';
  return (
    <svg className={className} width="46" height="34" viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 34 C 10 35, 18 30, 22 23 C 26 15, 23 6, 15 10 C 8 13, 11 25, 22 26 C 29 27, 34 22, 38 16" stroke={trail} strokeOpacity={color ? 0.6 : 0.7} strokeWidth="1.6" strokeDasharray="3 3" strokeLinecap="round"/>
      <g transform="translate(32, 2) rotate(8)">
        <path d="M0 12 L19 2 L12 21 L8 14 Z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M19 2 L8 14" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M8 14 L7 19 L10 16" stroke={c} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
function Header({openProfile,isHome}:{openProfile:(kind:string)=>void,isHome?:boolean}){
  const [mobile,setMobile]=useState(false);
  const [scrolled,setScrolled]=useState(false);

  useEffect(()=>{
    const handleScroll=()=>setScrolled(window.scrollY>40);
    window.addEventListener('scroll',handleScroll,{passive:true});
    handleScroll();
    return ()=>window.removeEventListener('scroll',handleScroll);
  },[]);

  return (
    <>
      <div className="topbar">
        <div className="wrap topbar-content">
          <div className="topbar-left">
            <a href="mailto:contact@nodebook.com" className="topbar-link">
              <HeaderMailIcon className="topbar-icon"/>
              <span>contact@nodebook.com</span>
            </a>
            <span className="topbar-sep" aria-hidden="true">|</span>
            <div className="topbar-location">
              <HeaderPinIcon className="topbar-icon"/>
              <span>RJ Mall 3rd Floor, G57, Karachi</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-socials" aria-label="Social media channels">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="topbar-social-link"><FacebookIcon/></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="topbar-social-link"><InstagramIcon/></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="topbar-social-link"><YoutubeIcon/></a>
            </div>
            <span className="topbar-sep" aria-hidden="true">|</span>
            <div className="topbar-auth">
              <button type="button" onClick={()=>openProfile('signup')} className="topbar-auth-btn"><UserPlusIcon/><span>Sign Up</span></button>
              <button type="button" onClick={()=>openProfile('signin')} className="topbar-auth-btn"><UserIcon/><span>Sign In</span></button>
            </div>
          </div>
        </div>
      </div>

      <header className={`site-header ${isHome && !scrolled ? 'header-transparent' : ''} ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="wrap header-content">
          <Brand/>
          <nav className={`main-nav ${mobile?'nav-open':''}`} aria-label="Main navigation">
            <Link href="/" onClick={()=>setMobile(false)}>HOME</Link>
            <div className="nav-dropdown">
              <Link href="/tour" onClick={()=>setMobile(false)}>TOUR <ChevronDown size={14}/></Link>
              <div className="dropdown-menu">
                <Link href="/tour">All Packages</Link>
                <Link href="/tour?destination=domestic">Pakistan Tours</Link>
                <Link href="/tour?destination=international">International Tours</Link>
                {international.map(p=><Link href={destinationLink(p)} key={p.slug}>{p.name}</Link>)}
              </div>
            </div>
            <div className="nav-dropdown">
              <Link href="/places" onClick={()=>setMobile(false)}>PLACE TO VISIT <ChevronDown size={14}/></Link>
              <div className="dropdown-menu wide-menu">
                {destinations.slice(0,10).map(p=><Link href={destinationLink(p)} key={p.slug}>{p.name}</Link>)}
                <Link href="/places">View all places</Link>
              </div>
            </div>
            <Link href="/contact" onClick={()=>setMobile(false)}>CONTACT US</Link>
            <PaperAirplaneDoodle className="nav-plane-doodle"/>
          </nav>

          <a href="tel:+923252551585" className="header-phone-box" aria-label="Call +92 325 2551585">
            <span className="header-phone-circle"><Phone size={17} fill="currentColor"/></span>
            <div className="header-phone-info">
              <span className="header-phone-number">+92 325 2551585</span>
              <span className="header-phone-label">24/7 Customer Support</span>
            </div>
          </a>

          <button className="mobile-toggle" aria-label={mobile?'Close menu':'Open menu'} onClick={()=>setMobile(!mobile)}>
            {mobile?<X/>:<Menu/>}
          </button>
        </div>
      </header>
    </>
  );
}
function Profile({kind,onClose}:{kind:string,onClose:()=>void}){const [profile,setProfile]=useState<{name:string,email:string}|null>(null);const [saved,setSaved]=useState<string[]>([]);useEffect(()=>{try{setProfile(JSON.parse(localStorage.getItem('nodebook-profile')||'null'));setSaved(JSON.parse(localStorage.getItem('nodebook-saved')||'[]'))}catch{}},[kind]);return <Dialog open={!!kind} onOpenChange={v=>{if(!v)onClose()}}><DialogContent className="profile-modal"><DialogHeader><DialogTitle>{profile?'Your travel shortlist':kind==='signup'?'Create your travel profile':'Open your travel profile'}</DialogTitle><DialogDescription>A simple profile saved on this device. No online account or password is created.</DialogDescription></DialogHeader>{profile?<><p>Hello, <strong>{profile.name}</strong> ({profile.email})</p><h4>Saved packages</h4>{saved.length?saved.map(slug=>{const t=trips.find(x=>x.slug===slug);return t?<Link href={tripLink(t)} key={slug} className="saved-trip">{t.title}<ArrowRight size={16}/></Link>:null}):<p>You have no saved tours yet. Tap the heart on a package to add one.</p>}<div className="confirm-actions"><Link href="/tour" className="btn btn-blue" onClick={onClose}>Explore packages</Link><button className="btn btn-outline" onClick={()=>{localStorage.removeItem('nodebook-profile');setProfile(null)}}>Sign out on this device</button></div></>:<form className="enquiry-form" onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);const p={name:String(f.get('name')),email:String(f.get('email'))};localStorage.setItem('nodebook-profile',JSON.stringify(p));setProfile(p)}}><label>Your name<input name="name" required minLength={2} placeholder="Name"/></label><label>Email<input name="email" type="email" required placeholder="Email"/></label><button className="btn btn-blue" type="submit">Save profile</button></form>}</DialogContent></Dialog>}
export default function TravelApp(){const path=usePathname()||'/';const router=useRouter();const [profile,setProfile]=useState('');let content:React.ReactNode;if(path==='/')content=<Home goSearch={s=>router.push(s?`/tour?destination=${encodeURIComponent(s)}`:'/tour')}/>;else if(path==='/tour')content=<React.Suspense fallback={<div className="wrap section">Loading tours…</div>}><TourListing/></React.Suspense>;else if(path==='/places')content=<Places/>;else if(path==='/contact')content=<Contact/>;else if(path.startsWith('/location/'))content=<Destination slug={path.split('/')[2]}/>;else if(path.startsWith('/tour/'))content=<TripDetail slug={path.split('/')[2]}/>;else if(path==='/page/about-us')content=<About/>;else if(path==='/page/credits')content=<Credits/>;else if(path.startsWith('/page/'))content=<Policy kind={path.split('/')[2]}/>;else content=<NotFound/>;return <><Header openProfile={setProfile} isHome={path==='/'}/>{content}<Footer/><Link href="/contact" className="floating-contact" aria-label="Plan a trip"><Send size={19}/></Link><Profile kind={profile} onClose={()=>setProfile('')}/></>}
