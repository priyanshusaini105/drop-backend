// Optimize the code for better performance:

import express from "express";
import { getJson } from "serpapi";
import { ProductInfo } from "../types";
import jwt from "jsonwebtoken";
import { User } from "../model";
import { PinnedModel } from "../model/pinned";
import { sendMail } from "../services/email";

const productRouter = express.Router();
const allowedDomains = [
  "amazon.in",
  "flipkart.in",
  "myntra.com",
  "flipkart.com",
  "amazon.com",
];

const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;

const LOCATION = "Delhi,+India";

const resu = {
  item: [
    {
      position: 1,
      title: "Apple iPhone 14 (128 GB, Blue)",
      link: "https://www.apple.com/in/shop/go/product/MPVN3?cid=aos-in-seo-pla-iphone",
      product_link:
        "https://www.google.co.in/shopping/product/4977685834647550342?gl=in",
      product_id: "4977685834647550342",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=4977685834647550342",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/4977685834647550342/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:2342967410009367086_0,pid:8159620919666937869,rsk:PC_9262457978745345203&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECMkN",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A2342967410009367086_0%2Cpid%3A8159620919666937869%2Crsk%3APC_9262457978745345203&gl=in&offers=1&product_id=4977685834647550342&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECMkN",
      source: "Apple",
      price: "₹69,900.00",
      extracted_price: 69900,
      rating: 4.5,
      reviews: 10003,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTwHGFf3u2gQQ3qnRoLaEQfAedADIHQfcFvioVHjXhpH4VINK0AFVjtZvEEVbLTdoLG1mo1oD0kFhn3nuwHd01MpbAz4nnUjxs5HrRFyPKstUIBTz4Dtceitj8&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 2,
      title: "Apple iPhone 15 Pro - 128 GB - Blue Titanium",
      link: "https://www.google.co.in/shopping/product/15865315161862473473?hl=en&prds=oid:11576380107480184826,pid:12431211345468293509&sts=9&lsf=seller:10736904,store:5034308547823242180,s:h",
      product_link:
        "https://www.google.co.in/shopping/product/15865315161862473473?gl=in",
      product_id: "15865315161862473473",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=15865315161862473473",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/15865315161862473473/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:11576380107480184826_0,local:1,pid:12431211345468293509,prmr:2,rsk:PC_11795796123145720151&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECNoN",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A11576380107480184826_0%2Clocal%3A1%2Cpid%3A12431211345468293509%2Cprmr%3A2%2Crsk%3APC_11795796123145720151&gl=in&offers=1&product_id=15865315161862473473&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECNoN",
      source: "Croma",
      price: "₹1,30,990.00",
      extracted_price: 130990,
      rating: 4.1,
      reviews: 3882,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRmr5Ylbx85mUojGiRFghkHUk3V0TlBcvS7EvVJEXGjgwyui6K17ejQbKPN8l64a-LVXUZc6gNNp-oJwM_yKfBX1kytzSrg8xLbNeJwzRHvqTMHmWXt54D_xVw&usqp=CAE",
      delivery: "78.7 km · In stock",
    },
    {
      position: 3,
      title: "APPLE iPhone 13 (RED, 256 GB)",
      link: "https://www.amazon.in/Apple-iPhone-13-256GB-Product/dp/B09G9HDN4Q?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A14CZOWI0VEHLG",
      product_link:
        "https://www.google.co.in/shopping/product/3305507197083143725?gl=in",
      product_id: "3305507197083143725",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=3305507197083143725",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/3305507197083143725/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:13730994653198493543_0,pid:8234421707624464174,rsk:PC_6664780716957042795&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECOsN",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A13730994653198493543_0%2Cpid%3A8234421707624464174%2Crsk%3APC_6664780716957042795&gl=in&offers=1&product_id=3305507197083143725&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECOsN",
      source: "Amazon.in",
      price: "₹61,999.00",
      extracted_price: 61999,
      rating: 4.7,
      reviews: 15771,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQXbzN_HioNPjb0up7_Jcz9t4nPnSeK71h4McGXWuIRwf2GSP_3VDFLTjisBrdLAu3F6R52siSdgU4c3OF5ir8TEckWGUkXk_nYNZqXoHu02FrWPSq0G8e_&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 4,
      title: "Apple iPhone 12 (64 GB, Green)",
      link: "http://www.flipkart.com/apple-iphone-12-green-64-gb/p/itmc8a19a9686173?pid=MOBFWBYZKK3EJPFW&lid=LSTMOBFWBYZKK3EJPFW7Z5IXN&marketplace=FLIPKART&cmpid=content_mobile_8965229628_gmc",
      product_link:
        "https://www.google.co.in/shopping/product/5035514451100233061?gl=in",
      product_id: "5035514451100233061",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=5035514451100233061",
      number_of_comparisons: "5+",
      comparison_link:
        "https://www.google.co.in/shopping/product/5035514451100233061/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:852226917372192234_0,pid:13538658500517280237,rsk:PC_14074616196041694734&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECPwN",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A852226917372192234_0%2Cpid%3A13538658500517280237%2Crsk%3APC_14074616196041694734&gl=in&offers=1&product_id=5035514451100233061&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECPwN",
      source: "Flipkart",
      price: "₹42,999.00",
      extracted_price: 42999,
      rating: 4.5,
      reviews: 30720,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTQqYOOMn9nmPT-rj40ZKF3iEHF-cetmsdpsv16BpIqTnLOVCnGpoUp0QqaUA95PZDGUY6UfEV4WEmns3QMt3hy8T93kusCI1Wnot8Rl_eT0yuK-xpRdNtBIw&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 5,
      title: "Apple iPhone 15 - 128 GB - Yellow",
      link: "https://www.reliancedigital.in/apple-iphone-15-128gb-yellow/p/493839311?srsltid=AfmBOoqefwlv867VDT17oNfh5YmL6KHiWDUertV2Qxe6VRgP0_zWgVPNDRs",
      product_link:
        "https://www.google.co.in/shopping/product/10488904565149379205?gl=in",
      product_id: "10488904565149379205",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=10488904565149379205",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/10488904565149379205/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:9630810975111661203_0,pid:11878455949149270336,rsk:PC_6601648695432433635&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECI0O",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A9630810975111661203_0%2Cpid%3A11878455949149270336%2Crsk%3APC_6601648695432433635&gl=in&offers=1&product_id=10488904565149379205&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECI0O",
      source: "Reliance Digital",
      price: "₹74,900.00",
      extracted_price: 74900,
      rating: 4.2,
      reviews: 2148,
      extensions: ["Smartphone", "Single SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTVqwnfx65i3nEP5E2nVo92glBuSGE-EM-_eK85OsylNlNMqeuSuATM_uLCgDeAgKOCmj7F3Eq4JI9iaxh_KqNPfxHWQFtCl8xkePIpITrAVA5D7mMAHwbXF7w&usqp=CAE",
      delivery: "Free delivery by 26 Jan and free 5-day returns",
    },
    {
      position: 6,
      title: "iPhone 14 Plus 128 GB Product RED",
      link: "https://www.maplestore.in/products/iphone-14-mq513hn-a?variant=45947371192610&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOorGIKXfaSWWevFxBn_ULkE7OZITxTw0X_tCBF1b4uw63ZvQsWFaFKs",
      product_link:
        "https://www.google.co.in/shopping/product/11117644501713906757?gl=in",
      product_id: "11117644501713906757",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=11117644501713906757",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/11117644501713906757/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:15429046116315994378_0,pid:14347752993756367725,rsk:PC_9468624372169813779&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJ4O",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A15429046116315994378_0%2Cpid%3A14347752993756367725%2Crsk%3APC_9468624372169813779&gl=in&offers=1&product_id=11117644501713906757&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJ4O",
      source: "Maple Store",
      price: "₹71,499.00",
      extracted_price: 71499,
      rating: 4.4,
      reviews: 4560,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTHjVrsz8gYPfiGpvUcfglRfXPgNz7DZkg-e0F1oXJrXe91T7RknbBEapoESFw32zH-uQirSle7QXvA5g8wdUgFqm4wSUXo3R66nTq4wQg0o3_6p0uC7W0P&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 7,
      title: "Apple iPhone 13 128 GB, Blue",
      link: "https://inventstore.in/product/iphone-13/?attribute_pa_color=blue&attribute_pa_storage=128gb&srsltid=AfmBOorIxkdQHcmP7YYoKJOXunkmn2YEBwWFTLFxQcpttWAka7zlk4LStuc",
      product_link:
        "https://www.google.co.in/shopping/product/17833108444152321586?gl=in",
      product_id: "17833108444152321586",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=17833108444152321586",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/17833108444152321586/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:15089648655608832950_0,pid:14551962712937607464,rsk:PC_8971650804785857268&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECLEO",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A15089648655608832950_0%2Cpid%3A14551962712937607464%2Crsk%3APC_8971650804785857268&gl=in&offers=1&product_id=17833108444152321586&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECLEO",
      source: "iNvent - Apple Premium Reseller",
      price: "₹55,900.00",
      extracted_price: 55900,
      old_price: "₹59,900.00",
      extracted_old_price: 59900,
      rating: 4.6,
      reviews: 16904,
      extensions: ["Smartphone", "Dual SIM", "4G", "SALE"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTsJei8lQO2YOQfMQgdb1np6yVeZZSt456X79q47y4l2eZLM8nu3fLDyXSo2if7IH6SNo9v3RoNHDHELWpiXSNtvXPEcThIPg9bMJy1YubbFt9Rml2YDH7Yow&usqp=CAE",
      tag: "SALE",
      delivery: "Free delivery",
    },
    {
      position: 8,
      title: "Apple iPhone 15 Pro Max - 1 TB - Black Titanium",
      link: "https://suprememobiles.in/products/apple-iphone-15-pro-max-1tb-storage?variant=41554030100537&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOor2oCIN6Ea93NwszVNR-bHiY-i9Ff53PeTnSxdyAeFJSa605TYlj2U",
      product_link:
        "https://www.google.co.in/shopping/product/10586681404671976349?gl=in",
      product_id: "10586681404671976349",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=10586681404671976349",
      number_of_comparisons: "5+",
      comparison_link:
        "https://www.google.co.in/shopping/product/10586681404671976349/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:8015887742453122085_0,pid:783518521560854059,rsk:PC_8690522275515055488&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECMIO",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A8015887742453122085_0%2Cpid%3A783518521560854059%2Crsk%3APC_8690522275515055488&gl=in&offers=1&product_id=10586681404671976349&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECMIO",
      source: "Supreme Mobiles",
      price: "₹1,99,900.00",
      extracted_price: 199900,
      rating: 4.3,
      reviews: 6480,
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQcAm4EyXts3mBeCy-zKeLLv2VACMtojPdI7dmXybfeQo5_956SESFrZwLFxkS30N9IPLAYWdc-zImNj6zEMKrkoxguDeSWz4t47Mc4ZZbO4vLGYEUc0Lwi&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 9,
      title: "Apple iPhone X 64 GB Space Grey",
      link: "https://vlebazaar.in/apple-iphone-x-64gb-space-grey-refurbished",
      product_link:
        "https://www.google.co.in/shopping/product/5368540131121746813?gl=in",
      product_id: "5368540131121746813",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=5368540131121746813",
      number_of_comparisons: "5+",
      comparison_link:
        "https://www.google.co.in/shopping/product/5368540131121746813/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:12659881530035388006_0,pid:13763101651798733826,rsk:PC_13295346759454735556&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECNQO",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A12659881530035388006_0%2Cpid%3A13763101651798733826%2Crsk%3APC_13295346759454735556&gl=in&offers=1&product_id=5368540131121746813&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECNQO",
      source: "vlebazaar",
      price: "₹15,499.00",
      extracted_price: 15499,
      second_hand_condition: "refurbished",
      rating: 4.4,
      reviews: 36404,
      extensions: ["Smartphone", "Single SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQfbNO84t4enoqyDLax0L38qBkQXPb6j-Ksfb7roK8LpM8j3yOu1xm3x1FokboGogj41rixcxUJhqeJhkK8sCqHY88MsslonB6XVqILJEgUCYu8R10-ZNKLmw&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 10,
      title: "Apple iPhone 14 Plus (128 GB, Midnight)",
      link: "https://www.lotuselectronics.com/product/iphones/apple-iphone-mobile-14-plus-128gb-rom-mq4x3hna-midnight/34568?srsltid=AfmBOorSbEiSwdq-lJqXqIgYX7zaFjxBhAZw6h_YIBR0paqlxdnBvquET0U",
      product_link:
        "https://www.google.co.in/shopping/product/4833938907958673535?gl=in",
      product_id: "4833938907958673535",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=4833938907958673535",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/4833938907958673535/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:1566395924317453468_0,pid:15233856336241026521,rsk:PC_4902764599369140353&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECOUO",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A1566395924317453468_0%2Cpid%3A15233856336241026521%2Crsk%3APC_4902764599369140353&gl=in&offers=1&product_id=4833938907958673535&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECOUO",
      source: "Lotus Electronics",
      price: "₹74,900.00",
      extracted_price: 74900,
      rating: 4.4,
      reviews: 4198,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSkMi5jxSwAy0WdlXx_as-dmJFEAdXwnD6mQzkMA48YjUSZX_ku8ynH3Fz4jJewRvbenTANuqB7vqwuMsu5YFwVAFajPYiBvBAIMwuL6b990ckjG_Lfx0L1fg&usqp=CAE",
      delivery: "Free delivery by 16 Feb and free 7-day returns",
    },
    {
      position: 11,
      title: "Apple iPhone 11 (128 GB, Black)",
      link: "https://ovantica.com/buy-refurbished-iphones/renewed-iphone-11/5260?srsltid=AfmBOoqNtUy58rMO3e6DNsKm4ah-M1NOyGSGvFWz2FpRVV2kuoAyKUZEVeQ",
      product_link:
        "https://www.google.co.in/shopping/product/9734452885471933269?gl=in",
      product_id: "9734452885471933269",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=9734452885471933269",
      number_of_comparisons: "5+",
      comparison_link:
        "https://www.google.co.in/shopping/product/9734452885471933269/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:11392572465442734284_0,pid:14867176489801307476,rsk:PC_8023149794696260886&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECPcO",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A11392572465442734284_0%2Cpid%3A14867176489801307476%2Crsk%3APC_8023149794696260886&gl=in&offers=1&product_id=9734452885471933269&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECPcO",
      source: "Ovantica.com",
      price: "₹28,499.00",
      extracted_price: 28499,
      second_hand_condition: "refurbished",
      rating: 4.6,
      reviews: 92991,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTb-UOLAQdpeJtbAw8ZZn1VZkIaBup5IS_6KZfj2P9yGQcP33C-VBeUI43dxbNwl8GFHbcJd-1Jd_dHjnIyYT9qDGN2bS9Ww7myEvwrDMQOt6UBl_q1NEmudw&usqp=CAE",
      delivery: "Free delivery by 29 Jan and free 7-day returns",
    },
    {
      position: 12,
      title: "Apple iPhone 12 - (Open Box Mobile)",
      link: "https://bestbuymobiles.in/shop/open-box-smartphones/brands/apple/apple-iphone-12-open-box-mobile/?attribute_pa_color=apple-14-blue&attribute_pa_storage=128gb&attribute_pa_condition=good",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:10662457978657009336",
      product_id: "10662457978657009336",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=10662457978657009336",
      source: "Bestbuy Mobiles",
      price: "₹25,999.00",
      extracted_price: 25999,
      second_hand_condition: "used",
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQjmLQ2h08fxGekbauL4ggQ697Fc7F8HLyHo8p4afZaJ-FqXmVPX8zUWg_Sa3u-U4UJ1aqx60gkvP9g5s_ToS5B6KmPojGGQnNcZ1fwI3v_t6jqbf9S2wTu1w&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 13,
      title: "Apple iPhone 14 Pro 128 GB, Space Black",
      link: "https://www.ohlocal.in/product?detail=product_details&product_id=SM971228AP&srsltid=AfmBOorxR9O_svflwVRX8sUMlZdgMKMaG_k_Be6Nvk5C-Yb1Wiqrnzlvuuc",
      product_link:
        "https://www.google.co.in/shopping/product/687483497619442676?gl=in",
      product_id: "687483497619442676",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=687483497619442676",
      number_of_comparisons: "4",
      comparison_link:
        "https://www.google.co.in/shopping/product/687483497619442676/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:13262391677018812219_0,pid:15106809174857756571,rsk:PC_249950349010311029&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJgP",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A13262391677018812219_0%2Cpid%3A15106809174857756571%2Crsk%3APC_249950349010311029&gl=in&offers=1&product_id=687483497619442676&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJgP",
      source: "OhLocal",
      price: "₹1,27,302.00",
      extracted_price: 127302,
      rating: 4.5,
      reviews: 10919,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTXc-KkKNDEyQ8HKpiYgqu118QQM69koVF_lqjAD5cBPVwXeFp_Io2xnLoh82mUBzOfWsAlfjM4Ao6rFJCPDkfeCZECMpDRkFYcuupS7LKaVqUP64A3zV9hvw&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 14,
      title: "Apple iPhone 15 Plus - 128 GB - Green",
      link: "https://www.bigcmobiles.com/mobiles/iphone-15-plus-128gb-green",
      product_link:
        "https://www.google.co.in/shopping/product/14877630575359040395?gl=in",
      product_id: "14877630575359040395",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=14877630575359040395",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/14877630575359040395/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:4283620281284419317_0,pid:14922253201502402624,rsk:PC_4702526954592161872&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECKkP",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A4283620281284419317_0%2Cpid%3A14922253201502402624%2Crsk%3APC_4702526954592161872&gl=in&offers=1&product_id=14877630575359040395&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECKkP",
      source: "Big C Mobiles",
      price: "₹84,900.00",
      extracted_price: 84900,
      rating: 4.4,
      reviews: 1411,
      extensions: ["Smartphone", "Single SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRR_fexOIWw4ac63vQ6MSD063o0B3kNAG20i23fqOjbUBjiQxyayNx69xqAEr2RFzRehREzUugjW9Jw7n83D2589QTViWzFTQx2yXUGcKclqvybtgHcAhe8&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 15,
      title: "Apple iphone 11 64 white",
      link: "https://www.shopwish.in/product/iphone-11-64gb-white/?srsltid=AfmBOopg78R6RVxzgqKsKgEpiY9qiVRK43_hBVzOaxb2uYsCqatm6CP8e0k",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:14722914691719171158",
      product_id: "14722914691719171158",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=14722914691719171158",
      source: "ShopWish.In",
      price: "₹18,999.00",
      extracted_price: 18999,
      second_hand_condition: "refurbished",
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTpP3LYxX9lsju7U6CwTUgnQXv44AWbcc4zeIjOPzKJnkovrpzCiEHt7cP-HNCYtti82TdBRqN_CiyX4AUv_6R_bIopfhM_Yg&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 16,
      title: "Buy Used Apple iPhone XR 64GB Red",
      link: "https://buy.budli.in/products/iphone-xr-64gb-red?variant=40293136859199&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOorviry491QeZOuTVkT4uD26eepgr0PwK-yk2ajJ_pRcVRjBHHs4UXA&com_cvv=d30042528f072ba8a22b19c81250437cd47a2f30330f0ed03551c4efdaf3409e",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:1915418261458044886",
      product_id: "1915418261458044886",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=1915418261458044886",
      source: "Budli.in",
      price: "₹12,999.00",
      extracted_price: 12999,
      second_hand_condition: "refurbished",
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRNk1xNaPOrvBGOY07F9BRgZH0iJwlznhLIHbw6ys4FO6mD3_6ZycpD5LO68Lc35gt-lV8Lz3CBq3eaT6NLNOumQ8hsofEuIaSIdYZaApvWlsrDpM3cJvXM&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 17,
      title: "Apple iPhone 15 Pro - 128 GB - Black Titanium",
      link: "https://93mobiles.com/product/2714/?wcpbc-manual-country=IN",
      product_link:
        "https://www.google.co.in/shopping/product/3225823599495019368?gl=in",
      product_id: "3225823599495019368",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=3225823599495019368",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/3225823599495019368/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:6307174096323282987_0,pid:12337596112653343762,rsk:PC_11795796123145720151&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECNkP",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A6307174096323282987_0%2Cpid%3A12337596112653343762%2Crsk%3APC_11795796123145720151&gl=in&offers=1&product_id=3225823599495019368&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECNkP",
      source: "93mobiles.com",
      price: "₹1,14,999.00",
      extracted_price: 114999,
      rating: 4.1,
      reviews: 3882,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTGpQ1cKjGZb9XBVbUx8PnDcEWzdz3L80ES8vVzO07BULH97Ek7RFIMK_0wtdtXBFR6IqIYkk1DkWCF8evIjHTm1vs9_UvbN_6wzcDSsy81WujJ5PrBnZYZLT4&usqp=CAE",
      delivery: "+Delivery",
    },
    {
      position: 18,
      title: "Apple iPhone 14 (128 GB, Starlight)",
      link: "https://viveks.com/apple-smart-phone-14-128-gb-starlight",
      product_link:
        "https://www.google.co.in/shopping/product/3606892602698156037?gl=in",
      product_id: "3606892602698156037",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=3606892602698156037",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/3606892602698156037/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:12043966338348014657_0,pid:5529114437286244377,rsk:PC_8053804293482199477&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECOoP",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A12043966338348014657_0%2Cpid%3A5529114437286244377%2Crsk%3APC_8053804293482199477&gl=in&offers=1&product_id=3606892602698156037&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECOoP",
      source: "Viveks",
      price: "₹64,900.00",
      extracted_price: 64900,
      rating: 4.4,
      reviews: 8840,
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRTUHavwDUTRX8d2HpWMOIjTXp5HpS2sofsP2fzxvYepByXV6_quLUAuoaE_4ZNeZWcszyL5edZMOcJwPmY1XrF1_-yPamwWc5W3DzA2ud-CWSTJQ5DXNhXtLc&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 19,
      title: "Apple iPhone 12 (128GB) - Black",
      link: "https://www.triveniworld.com/products/apple-iphone-12-pro-max-128gb-graphite?variant=47357195944233&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOoq7h4OGybK7PQ5WLzuowPvUXZ_N8oGSYprE08wDcNuZD8Al6uC4tAw",
      product_link:
        "https://www.google.co.in/shopping/product/1833165342148870496?gl=in",
      product_id: "1833165342148870496",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=1833165342148870496",
      source: "Triveni World",
      price: "₹35,999.00",
      extracted_price: 35999,
      rating: 4.6,
      reviews: 656,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTWlxYoQq8_warVT6TIV-ksx7OYUH0Im-NUMUoCasYlD56yb7Kj9GLfP1baJ_yVsJRlEsNWsO_T6EaY9P47HtYIUJjik3gLCjlQYNiSerR7h5W3IXhS6qIy_g&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 20,
      title: "Apple iPhone 12 Mini (64 GB, Purple)",
      link: "https://ovantica.com/buy-refurbished-iphones/renewed-iphone-12-mini/5374?srsltid=AfmBOorYY6tdgKuCtUktLwsmulVNbDsmUHyIPJESoAwxFeWDaSUBmFocWiQ",
      product_link:
        "https://www.google.co.in/shopping/product/12314144563378793423?gl=in",
      product_id: "12314144563378793423",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=12314144563378793423",
      number_of_comparisons: "2",
      comparison_link:
        "https://www.google.co.in/shopping/product/12314144563378793423/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:9274069526035574862_0,pid:642397725956771977,rsk:PC_3506807150760730423&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECIwQ",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A9274069526035574862_0%2Cpid%3A642397725956771977%2Crsk%3APC_3506807150760730423&gl=in&offers=1&product_id=12314144563378793423&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECIwQ",
      source: "Ovantica.com",
      price: "₹29,399.00",
      extracted_price: 29399,
      second_hand_condition: "refurbished",
      rating: 4.5,
      reviews: 13831,
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR83lvDPrVDhoXGKC2ysRwE6AAh4ozQgA10ZuYv81pLA-dudGhGFi5HcViJ3gDRTVyDQ96gnlnanVV0MBkPT8n7DVo7u6JtCPH__zXgEx_f&usqp=CAE",
      delivery: "Free delivery by 29 Jan and free 7-day returns",
    },
    {
      position: 21,
      title: "Apple iPhone 12 Pro Max 512 GB, Silver",
      link: "https://www.addmecart.com/shop/mobile-accessories/smart-phone-tab/iphones/apple-iphone-12-pro-max-silver-512-gb/?utm_source=Google+Shopping&utm_medium=cpc&utm_campaign=new+feed+file",
      product_link:
        "https://www.google.co.in/shopping/product/18097958452361468133?gl=in",
      product_id: "18097958452361468133",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=18097958452361468133",
      number_of_comparisons: "2",
      comparison_link:
        "https://www.google.co.in/shopping/product/18097958452361468133/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:15266935269728725361_0,pid:16448737033385600951,rsk:PC_8614981451121089051&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJ0Q",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A15266935269728725361_0%2Cpid%3A16448737033385600951%2Crsk%3APC_8614981451121089051&gl=in&offers=1&product_id=18097958452361468133&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJ0Q",
      source: "addmecart.com",
      price: "₹1,23,149.00",
      extracted_price: 123149,
      rating: 4.6,
      reviews: 16534,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQnX17EdR8KaZD0pAG8dkmLo_0CZxHcwOkVpct1oEk7G7ZUvkx8GWThbl_bCaQiD-kh_oLcZ7jdqw66FQ-9RQyM2k03aEZxs2b5UgMxSuZB&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 22,
      title: "Apple Iphone X",
      link: "https://unboxyourmobile.com/apple-iphone-x?search=apple%20iphone%20xs%20max&category_id=0",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:1513330100135834367",
      product_id: "1513330100135834367",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=1513330100135834367",
      source: "Unbox Your Mobile",
      price: "₹23,999.00",
      extracted_price: 23999,
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSC_y5LVi9GQ4_qoUY5FK0o9diIY0TxwtWH0CR46Oe8Xx0W6UmiBxHLfQna8x6BgI8JjRcfgpdtjj6ZdwPkn6qwsCtKCgXKUdM-PpjUM1nR53qSnzvZyr2C&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 23,
      title: "Apple iPhone 14 Pro Max (128 GB, Gold)",
      link: "https://www.maplestore.in/products/iphone-14-pro-mq9r3hn-a?variant=45947470545186&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOoo-TSWMFJWld6zQ11w9uq76OZSSCg52G5fWQweNNlHlX5g9OFYF3ww",
      product_link:
        "https://www.google.co.in/shopping/product/7423663586957234995?gl=in",
      product_id: "7423663586957234995",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=7423663586957234995",
      number_of_comparisons: "3",
      comparison_link:
        "https://www.google.co.in/shopping/product/7423663586957234995/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:15043627770583031972_0,pid:17244357272336482621,rsk:PC_4029413164180478037&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECLwQ",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A15043627770583031972_0%2Cpid%3A17244357272336482621%2Crsk%3APC_4029413164180478037&gl=in&offers=1&product_id=7423663586957234995&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECLwQ",
      source: "Maple Store",
      price: "₹1,31,499.00",
      extracted_price: 131499,
      rating: 4.5,
      reviews: 7711,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR8zOKDn_tD7DiNfcd2ejGqI3Gfs9PeSLzuaz0b7I4i5SEsBT3_0uqp_gKcOI9nQD66JBPcREJB2BN3-B5p3f0VKRY8ZzA_1RAiLcEzEnyu2eezblIrBxtn&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 24,
      title: "Apple Iphone 11 Unboxed",
      link: "https://theyoungindians.com/product/apple-iphone-11-unboxed/",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:13354685827298791932",
      product_id: "13354685827298791932",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=13354685827298791932",
      source: "The Young Indians",
      price: "₹25,499.00",
      extracted_price: 25499,
      rating: 4.6,
      reviews: 92991,
      extensions: ["Smartphone", "Dual SIM", "iOS"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRwJ9qg-eG_NHJJKJbHO-ZPbIaDqEJbodtSRqJbFlVnKV4IO9ImBpcVvW89rHzOvhdHBzUuGbyegFdH36tMTyKAM_YzYe0CH8Kf62_WBdw&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 25,
      title: "Apple iPhone 13 (512 GB, Green)",
      link: "https://www.vijaysales.com/apple-iphone-13-512-gb-green/19498",
      product_link:
        "https://www.google.co.in/shopping/product/4719754704183210229?gl=in",
      product_id: "4719754704183210229",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=4719754704183210229",
      number_of_comparisons: "5+",
      comparison_link:
        "https://www.google.co.in/shopping/product/4719754704183210229/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:11189476076666564584_0,pid:6518265687307075590,rsk:PROD_VAR_1310732944009804032&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECN0Q",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A11189476076666564584_0%2Cpid%3A6518265687307075590%2Crsk%3APROD_VAR_1310732944009804032&gl=in&offers=1&product_id=4719754704183210229&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECN0Q",
      source: "Vijay Sales",
      price: "₹81,900.00",
      extracted_price: 81900,
      rating: 4.6,
      reviews: 705,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQxEdgqBOlwEPxmWNiv1eEHJhxxJufS3Jmj1VeGs29SA-BAHrD2nsH4Vb8l77qGfZRc3dD3rpixddUrGXoqoqILOijEmQz0WxJibGbbO8v5grgt0KkztBvm&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 26,
      title: "Apple iPhone 13 Pro 128 GB, Gold",
      link: "https://www.tryitfirst.in/apple-iphone-13-pro-128-gb-gold.html",
      product_link:
        "https://www.google.co.in/shopping/product/1333654691484274807?gl=in",
      product_id: "1333654691484274807",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=1333654691484274807",
      number_of_comparisons: "3",
      comparison_link:
        "https://www.google.co.in/shopping/product/1333654691484274807/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:8229568523394896977_0,pid:5457978606091033186,rsk:PC_10312337509962765968&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECO4Q",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A8229568523394896977_0%2Cpid%3A5457978606091033186%2Crsk%3APC_10312337509962765968&gl=in&offers=1&product_id=1333654691484274807&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECO4Q",
      source: "Tryitfirst.in",
      price: "₹1,19,900.00",
      extracted_price: 119900,
      rating: 4.4,
      reviews: 4875,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRQuzjYbOUEK5lnPgbnpj2YHXfC5bQXrkkCLW5Nx9AzPrQqB8s-oJqy09ta2IFOm3A4u7mGqcxHZwuDNtAsjNFSP-WGQJnoGn3ByIMynjt30VUUKNzwE84ogQ&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 27,
      title: "Apple iPhone SE 256GB (PRODUCT)RED",
      link: "https://www.google.co.in/shopping/product/18085443182424546540?hl=en&prds=oid:15301377765221274192,pid:9297417634524853914&sts=9&lsf=seller:10736904,store:14321168986871643058,s:h",
      product_link:
        "https://www.google.co.in/shopping/product/18085443182424546540?gl=in",
      product_id: "18085443182424546540",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=18085443182424546540",
      number_of_comparisons: "4",
      comparison_link:
        "https://www.google.co.in/shopping/product/18085443182424546540/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:15301377765221274192_0,local:1,pid:9297417634524853914,prmr:2,rsk:PC_12594811603708976079&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECP8Q",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A15301377765221274192_0%2Clocal%3A1%2Cpid%3A9297417634524853914%2Cprmr%3A2%2Crsk%3APC_12594811603708976079&gl=in&offers=1&product_id=18085443182424546540&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECP8Q",
      source: "Croma",
      price: "₹58,900.00",
      extracted_price: 58900,
      rating: 4.6,
      reviews: 7446,
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR-tn37HDUJRDnW33-uXJqBMNpb_HGa6DWquthB7jlL9STP2q4rLNvyFPWsOnp2UErRNnjBn4OSPXJ_K0a4-DVMbtUwdnbdkcNCu7uJ8maF3iDAOQiIrSbu&usqp=CAE",
      delivery: "17.7 km · In stock",
    },
    {
      position: 28,
      title: "Apple iPhone 11 (64GB) Green - Renewed",
      link: "https://www.triveniworld.com/products/apple-iphone-11-64gb-green-renewed?variant=47357042065705&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOoqJ90lxW3D21JAynU50H1aHI9c48CUSDuUESZ-YQ6kK6GMon47JrOY",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:4957306359813955617",
      product_id: "4957306359813955617",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=4957306359813955617",
      source: "Triveni World",
      price: "₹19,999.00",
      extracted_price: 19999,
      second_hand_condition: "used",
      rating: 4.6,
      reviews: 92991,
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTlp3kAK3iF_UGst7ENaI7yx890ogBgwTQFiGSjQnhKgttkbmZeSEiLs5b1fz9J61mCKCUrhhFV2GZ7P1yxK7S_UMLYhL7qjXx4sBHZxSqw&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 29,
      title: "APPLE iPhone 13 Mini (Pink, 128 GB)",
      link: "https://www.fliptwirls.com/shop/mobile-accessories/smart-phone-tab/apple-iphone/apple-iphone-13-mini-pink-128-gb/?utm_source=Google+Shopping&utm_medium=cpc&utm_campaign=gmc&srsltid=AfmBOorsbrU6_MUst9F_teKhIxvYD59KXTh6f4Ed3iIUmB02k1Lddz7_hPU",
      product_link:
        "https://www.google.co.in/shopping/product/3586958887935836933?gl=in",
      product_id: "3586958887935836933",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=3586958887935836933",
      number_of_comparisons: "5+",
      comparison_link:
        "https://www.google.co.in/shopping/product/3586958887935836933/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:16928389860324242458_0,pid:17476641743813235611,rsk:PC_16825921221298407573&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECKAR",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A16928389860324242458_0%2Cpid%3A17476641743813235611%2Crsk%3APC_16825921221298407573&gl=in&offers=1&product_id=3586958887935836933&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECKAR",
      source: "fliptwirls.com",
      price: "₹47,999.00",
      extracted_price: 47999,
      rating: 4.6,
      reviews: 5989,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRHpm8xcrGaZNvSe70M8L31K9lICTQv9ufW7EFBiwZZJorEqM4cvRuvfmPH5-sxmWTESinzEjF8C7ehuB_KNOKPS6P37Z48JRnHh6xY_TE&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 30,
      title: "Apple iPhone 14 Pro Max (1 TB, Deep Purple)",
      link: "https://www.sahivalue.com/products/used-refurbished-apple-iphone-14-pro-max-1tb-540534/293890000035239113?srsltid=AfmBOoo5kAU56nFUmwOuMks2FyIT7ac8hTTLE9y-Bt6j5146nOD-eu3FlPM",
      product_link:
        "https://www.google.co.in/shopping/product/17258231940730304515?gl=in",
      product_id: "17258231940730304515",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=17258231940730304515",
      number_of_comparisons: "4",
      comparison_link:
        "https://www.google.co.in/shopping/product/17258231940730304515/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:4358504946516034110_0,pid:2946426123640501620,rsk:PC_8672923537105206374&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECLIR",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A4358504946516034110_0%2Cpid%3A2946426123640501620%2Crsk%3APC_8672923537105206374&gl=in&offers=1&product_id=17258231940730304515&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECLIR",
      source: "Sahivalue.com",
      price: "₹1,14,999.00",
      extracted_price: 114999,
      second_hand_condition: "refurbished",
      rating: 4.5,
      reviews: 10532,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTTMnW0NQoD_jac5_1C7nzMOCEWaJB2qQH-EkbNJT_eL7nx24mLKHaQl8-xcOHFUe-AIQd-FYiZ4Ke5qnBYyiYlt2KsDW0EXgvXRiS81nU1lgdkovzqvaimNw&usqp=CAE",
      delivery: "Free delivery by 23 Jan and free 7-day returns",
    },
    {
      position: 31,
      title:
        "Buy Renewed Apple iPhone 11 - Renewed - White - 64GB/4GB - Fair by Ovantica",
      link: "https://ovantica.com/buy-refurbished-iphones/renewed-iphone-11/5240?srsltid=AfmBOorcj2y_tgMk0vEtaKLja5KAZ3IpDbH-Q0hx1ipIex3I4W3v-Rmh4BQ",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:14741739277234838611",
      product_id: "14741739277234838611",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=14741739277234838611",
      source: "Ovantica.com",
      price: "₹22,999.00",
      extracted_price: 22999,
      second_hand_condition: "refurbished",
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcROven6u7VWvNYYzWdpk5oPENhcxtOm-Vgp_JbT5BgVb9F3PCuDky1R72OgpzhZG04U7AzKzESsmvid4gkUlwMnlCqg_4HXHEmXZ4GIYLM&usqp=CAE",
      delivery: "Free delivery by 29 Jan and free 7-day returns",
    },
    {
      position: 32,
      title: "Apple iPhone 13 128 GB, Midnight (Black)",
      link: "https://www.jiomart.com/p/electronics/apple-iphone-13-128-gb-midnight-black/590798548?source=shoppingads",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:15687763803855630535",
      product_id: "15687763803855630535",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=15687763803855630535",
      source: "JioMart - Electronics",
      price: "₹51,900.00",
      extracted_price: 51900,
      old_price: "₹59,900.00",
      extracted_old_price: 59900,
      extensions: ["Smartphone", "Single SIM", "5G", "SALE"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSAM2P4_Q-PqLDybgCOg0igwchF4RyOCU1w_Wm0c9c5kZlXWnqOmQ4WnNDm61ecJj9Vh09hpl2EZIVT-OL-tuHlQ1SD_oVSkQFHgfM1BqNiVI8ifUX-fxyQkg&usqp=CAE",
      tag: "SALE",
      delivery: "Free delivery by 24 Jan and free 5-day returns",
    },
    {
      position: 33,
      title: "Apple iPhone 12 – (Open Box Mobile)",
      link: "https://www.triveniworld.com/products/apple-iphone-12-open-box-mobile?variant=47362397012265&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOooM_VLSkL5mQeTqyyu-n7x9GRQPRSS35pCmbpP2mwmMwkgZcuqRlhc",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:17409843667545702430",
      product_id: "17409843667545702430",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=17409843667545702430",
      source: "Triveni World",
      price: "₹27,999.00",
      extracted_price: 27999,
      second_hand_condition: "used",
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRPQIZedjwS5OR4K5KaWT9pW8dNWcX1OhvnP7A16_QLefcpWep6gHiPulACVenzK9iTwvcM8R91Pu1oglKBlGunYTblhcH5JSWMHb04MvOSgDYi-OkD2h8S&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 34,
      title: "iPhone 13 5G (With Apple Warranty)",
      link: "https://itradeit.in/shop/iphone-13/?attribute_pa_color=midnight-black&attribute_pa_storage=128gb&srsltid=AfmBOoqmoQoK9uUr8hKqX4yEvi7Z_46DNLYzMpLErCNRQ8HIkD_4Bnheus4",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:1835944545345923344",
      product_id: "1835944545345923344",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=1835944545345923344",
      source: "iTradeit",
      price: "₹44,990.00",
      extracted_price: 44990,
      extensions: ["Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRTJHk2Y6ErAp6aFevVAy68eaBIEDLZ2pMAJnO09UEYrmTkCVq81wWdVIYC6IlzYHQP9QqPczVp9ovI-FOWR0rLLRM7mlZoMOPWnCWJoVe3j7GOcZ9xI1PqMw&usqp=CAE",
      delivery: "Free delivery by 1 Feb and free 7-day returns",
    },
    {
      position: 35,
      title: "Apple Iphone 8 Gold, 64 Gb",
      link: "https://cliktodeal.com/product/iphone-8-64-gb-import/?attribute_pa_color=gold",
      product_link:
        "https://www.google.co.in/shopping/product/13339368686357950157?gl=in",
      product_id: "13339368686357950157",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=13339368686357950157",
      number_of_comparisons: "2",
      comparison_link:
        "https://www.google.co.in/shopping/product/13339368686357950157/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:3215081542908722856_0,pid:4828668014825721167,rsk:PC_2279649599901893363&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECIES",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A3215081542908722856_0%2Cpid%3A4828668014825721167%2Crsk%3APC_2279649599901893363&gl=in&offers=1&product_id=13339368686357950157&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECIES",
      source: "cliktodeal",
      price: "₹19,400.00",
      extracted_price: 19400,
      rating: 4.4,
      reviews: 42685,
      extensions: ["Smartphone", "Single SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR1kpP_iagiOYcYjADm7HQHIe0CfsBUrnvnmChcpzsMIJg1ZND4F60zhgpCDdTidFGRonUkfoZSZD_1_j7_W-39DwfODc5QyOaua3GZVF8&usqp=CAE",
      delivery: "₹120.00 delivery",
    },
    {
      position: 36,
      title: "Apple iPhone 13 Pro Max 1 TB, Gold",
      link: "https://www.ohlocal.in/product?detail=product_details&product_id=SM971424AP&srsltid=AfmBOophXR-xzsB97taMiv4Oxyr3gkd4RWn0Q-vDvqaqgWltGUpY-YXU3KI",
      product_link:
        "https://www.google.co.in/shopping/product/1741888852360229737?gl=in",
      product_id: "1741888852360229737",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=1741888852360229737",
      number_of_comparisons: "2",
      comparison_link:
        "https://www.google.co.in/shopping/product/1741888852360229737/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:240981266440382886_0,pid:7427589787611831083,rsk:PC_8217023720749633348&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJIS",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A240981266440382886_0%2Cpid%3A7427589787611831083%2Crsk%3APC_8217023720749633348&gl=in&offers=1&product_id=1741888852360229737&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJIS",
      source: "OhLocal",
      price: "₹1,76,302.00",
      extracted_price: 176302,
      rating: 4.7,
      reviews: 15966,
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRIWEgMGKMJGRUCPC1nN4iLY8MCEk2JwH_R7CQLrH2zcdaQRgFCrQRf3ZAQj2j-ndGCq9BJ31gp4wEL205vyy9M5Y0b4g9T6Q84YePQhnq4zkoVDEgF7IHL&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 37,
      title: "Apple iPhone 13 - (Open Box Mobile)",
      link: "https://bestbuymobiles.in/shop/open-box-smartphones/brands/apple/apple-iphone-13-open-box-mobile/?attribute_pa_color=apple-14-blue&attribute_pa_storage=128gb&attribute_pa_condition=good",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:6941858001250016333",
      product_id: "6941858001250016333",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=6941858001250016333",
      source: "Bestbuy Mobiles",
      price: "₹48,999.00",
      extracted_price: 48999,
      second_hand_condition: "used",
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSL_5R063e4y-lx3JDfglnHx5k8Xf0Pg_NCy-bYKojXeJZsgErud29PjCOtl9s-4nMC37Eo9BUrC0NDzIPUZNGUIjxxeYSHI2mE-wjBAuvjf-4oN0N-9Quh&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 38,
      title:
        "Elegant Look Scratch Resistant Four Days Battery Backup And 9GB Ram Black Apple ...",
      link: "https://www.tradeindia.com/products/black-color-apple-iphone-with-with-800-days-battery-backup-and-9gb-ram-7550261.html",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:599124671353554662",
      product_id: "599124671353554662",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=599124671353554662",
      source: "Tradeindia.com",
      price: "₹25,000.00",
      extracted_price: 25000,
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQj24bbCA_pHyg6KBKJH0JXB9jI_Jej0LrARi_lhiXddKr2dZkSIV8UFjAtJ6Z-TG_gjuThLTWhtKrzPycuWFxwS4gcTtpmqslDyqY1LiPPRMEDhpLoMEqs5A&usqp=CAE",
      delivery: "+Delivery",
    },
    {
      position: 39,
      title: "Apple iPhone 13 128GB Storage",
      link: "https://www.triveniworld.com/products/apple-iphone-13-128gb-storage?variant=47355734720809&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOopcW2ARaJ-R9zr8qGEXkcJUuX9U3YLIiFo9cAbVhR6pZY6_lMOODaM",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:14701346335657738587",
      product_id: "14701346335657738587",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=14701346335657738587",
      source: "Triveni World",
      price: "₹34,999.00",
      extracted_price: 34999,
      extensions: ["Smartphone", "Dual SIM", "3G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRFzzKp1D09vfQepjfJOGMMlhkHmiacFDCg4mpiFJ6w6ICs-DsXtylD-rwrQz8NX56Bbn-DJT0srwOUIO3mpytJjq26WqZSaYqtNVf4B2LoSZPK6W3xTVWA&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 40,
      title: "Apple Iphone 7 Gold, 32 Gb",
      link: "https://vexclusive.in/apple-iphones/330-apple-iphone-7-32gb-certified-refurbished-very-good.html?srsltid=AfmBOooY1DYfSFwOcN_WjaspClTbsU26q725vy-jm3UEG21MDn-1E4wa1hg",
      product_link:
        "https://www.google.co.in/shopping/product/17861873044275754540?gl=in",
      product_id: "17861873044275754540",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=17861873044275754540",
      number_of_comparisons: "4",
      comparison_link:
        "https://www.google.co.in/shopping/product/17861873044275754540/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:7220643752939064042_0,pid:1873780783103748588,rsk:PC_6142244829115239135&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECNES",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A7220643752939064042_0%2Cpid%3A1873780783103748588%2Crsk%3APC_6142244829115239135&gl=in&offers=1&product_id=17861873044275754540&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECNES",
      source: "vexclusive.in",
      price: "₹13,990.00",
      extracted_price: 13990,
      second_hand_condition: "refurbished",
      rating: 4.4,
      reviews: 74741,
      extensions: ["Smartphone", "Single SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS1TlqooEUGa7q6wu_5Ltz4zsyb8Mkqo9-WOeQq8VbH-ZZg3aHBfutTODpW8LIIiHd5r5xCWX4MOJ6ExLwUTmC0mcBvjXiI9GMGTz702DaQNbWGG5eb1o3jMg&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 41,
      title: "Apple iPhone 14 - (Open Box Mobile)",
      link: "https://bestbuymobiles.in/shop/open-box-smartphones/brands/apple/apple-iphone-14-open-box-mobile/?attribute_pa_color=midnight&attribute_pa_storage=256gb&attribute_pa_condition=good",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:17656540535319801490",
      product_id: "17656540535319801490",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=17656540535319801490",
      source: "Bestbuy Mobiles",
      price: "₹54,999.00",
      extracted_price: 54999,
      second_hand_condition: "used",
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTtWlZ2Yd7y1tOOVhrhpR2PGaRslGAEcqBol0Up0VlnIkTQMAUQYL_QZTchFu73H1phg9VJhhBLl_0sYx3uEqifM7GtYSeP_iSyAIHxIFqsSfhKtCkafVHF&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 42,
      title: "Apple IPhone 8",
      link: "https://www.goodsbucket.com/product/apple-iphone-8/",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:4509324649701451506",
      product_id: "4509324649701451506",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=4509324649701451506",
      source: "GoodsBucket",
      price: "₹14,990.00",
      extracted_price: 14990,
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQBcR9s4fRpWVQo2B202aFOdJ5evBJc0d2-l-PaqVPnhpu4C68H6r59awnjgDYld6lokH69B4pdPjseBrTxrX6LIbg2Ty8CuocIzBGkBRKk5cIGaF763XVj&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 43,
      title: "Apple Iphone Xs Max Gold, 64 Gb",
      link: "https://shop.gadgetsnow.com/refurbished-mobiles/refurbished-apple-iphone-xs-max-64gb-gold-4gb-ram-/10043/p_G489345",
      product_link:
        "https://www.google.co.in/shopping/product/4200207056203827893?gl=in",
      product_id: "4200207056203827893",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=4200207056203827893",
      source: "Gadgets Now",
      price: "₹73,799.00",
      extracted_price: 73799,
      second_hand_condition: "refurbished",
      rating: 4.6,
      reviews: 15727,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQUvJDgl_LMARYOeGynTzLgstvduom8lFVO28F9R6UnRFaP_SlYsrHS84djF7fH7M5VGRIyqib06nm8Jk1skUHrTW3wS-LpfoRb8M89EsegPe2HQ_cukDVe3g&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 44,
      title: "Apple Iphone 11 Pro Max 64gb 6.5 ́ ́ One Size",
      link: "https://hilaptop.com/products/apple-iphone-11-pro-max-64gb-all-colours?variant=4962",
      product_link:
        "https://www.google.co.in/shopping/product/13704338542070626285?gl=in",
      product_id: "13704338542070626285",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=13704338542070626285",
      number_of_comparisons: "2",
      comparison_link:
        "https://www.google.co.in/shopping/product/13704338542070626285/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:9898189013000047110_0,pid:5301900172968540240,rsk:PROD_VAR_1395590427046914560&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJAT",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A9898189013000047110_0%2Cpid%3A5301900172968540240%2Crsk%3APROD_VAR_1395590427046914560&gl=in&offers=1&product_id=13704338542070626285&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECJAT",
      source: "hilaptop.com",
      price: "₹49,999.00",
      extracted_price: 49999,
      rating: 4.7,
      reviews: 5425,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTdLAq2I_uphOBT6HjIY8PiQMJG-Tt0879m7lh7V6AWTylcKVCE9ufTx_8g1klX0qG7KZuzB1D5GHPcqUjD4Zm-4R7EY9QygXN0kFJVoTZzgCz25Mnyy2qF&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 45,
      title: "Apple iPhone 15 Pro 128GB titanio blu",
      link: "https://www.apvision.in/product-page/iphone-15-pro?utm_source=google&utm_medium=wix_google_feed&utm_campaign=freelistings",
      product_link:
        "https://www.google.co.in/shopping/product/13780746704013582122?gl=in",
      product_id: "13780746704013582122",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=13780746704013582122",
      number_of_comparisons: "10+",
      comparison_link:
        "https://www.google.co.in/shopping/product/13780746704013582122/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:13878171300382439173_0,pid:3118271825423887959,rsk:PC_9298523988283991985&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECKET",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A13878171300382439173_0%2Cpid%3A3118271825423887959%2Crsk%3APC_9298523988283991985&gl=in&offers=1&product_id=13780746704013582122&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECKET",
      source: "Apvision Technologies",
      price: "₹1,34,900.00",
      extracted_price: 134900,
      rating: 4.5,
      reviews: 4392,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTuTg2R6XdYfuc92kRa9B4XJ3tG793sNtbVU08b3MXXPjcuhNINOaTQAhY8GqKDck-ccFHIcY1SVgt2bCNLenO1Vl6pIayM9ZxtB0iunEoXZVWVmvIFaQ2BduI&usqp=CAE",
      delivery: "+Delivery",
    },
    {
      position: 46,
      title: "Apple iPhone 13 Pro - Gold",
      link: "https://itradeit.in/shop/iphone-13-pro/?attribute_pa_color=gold&attribute_pa_storage=128gb&srsltid=AfmBOor__iQPmVg5MUxKS3M2_ToHrfBvmo6wyb9A1bvaANB8aXfquQHEskQ",
      product_link:
        "https://www.google.co.in/shopping/product/6406167173600829784?gl=in",
      product_id: "6406167173600829784",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=6406167173600829784",
      number_of_comparisons: "2",
      comparison_link:
        "https://www.google.co.in/shopping/product/6406167173600829784/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:8183260463798663711_0,pid:16775377832356960158,rsk:PC_12721096405768421674&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECLMT",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A8183260463798663711_0%2Cpid%3A16775377832356960158%2Crsk%3APC_12721096405768421674&gl=in&offers=1&product_id=6406167173600829784&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECLMT",
      source: "iTradeit",
      price: "₹71,990.00",
      extracted_price: 71990,
      second_hand_condition: "used",
      rating: 4.6,
      reviews: 9497,
      extensions: ["Smartphone", "Dual SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTZMHHJZTZqRUYqX1lWM16fSMfpZ_SHRjPu4504w_Ay4WxDhgCLqZjoWrR-jZo9ESmF6D6WuV6bXMFQLa0jJPyZRawD-S3DNB96L5Dn6ZD_&usqp=CAE",
      delivery: "Free delivery by 1 Feb and free 7-day returns",
    },
    {
      position: 47,
      title: "Apple iPhone 8 64GB Silver",
      link: "https://filpz.com/products/apple-iphone-8-64gb-silver?currency=INR&variant=32720572121170&stkn=57d9a1514d09&srsltid=AfmBOoqzILrgo2Xgd-GBxdF-Zgkoftg8b-YSp_fu_v8onzkpGGXirZ0zdN4",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:17628696175037486625",
      product_id: "17628696175037486625",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=17628696175037486625",
      source: "Filpz.com",
      price: "₹12,075.00",
      extracted_price: 12075,
      second_hand_condition: "refurbished",
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQyVj0vKl5bZgPW6t39jPNf-Rbde3QFpOQpkHdr9YLhC3YB1OIuKcjzD79EYdgvucnrSricicYooFwCgbhnbjrGzGO-LmWdKlcjZPH7u4kSLJzapJL0nOn_5Q&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 48,
      title: "Apple iPhone SE (32GB) - Rose Gold (Renewed)",
      link: "https://www.triveniworld.com/products/apple-iphone-se-32gb-rose-gold-renewed?variant=47362879586601&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOoo7vdxqhdFmyHd4dGIQpxNwr25xZhx8O6VTv-NYifUAQ_KoJQ5Imh0",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:7502234671760243760",
      product_id: "7502234671760243760",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=7502234671760243760",
      source: "Triveni World",
      price: "₹5,999.00",
      extracted_price: 5999,
      second_hand_condition: "used",
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTAgQ8z8u5yBi30Bbinf0a3JZVCxVav7ewad-E_TB3oY2z-v-c2LM3DroTXRfZksS0MXpTaZWSJhbHdqIroYEJCU1kxRsib&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 49,
      title: "Apple iPhone 15 128gb black",
      link: "https://imobiley.com/product/apple-iphone-15-128gb-black/",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:14965456910367308526",
      product_id: "14965456910367308526",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=14965456910367308526",
      source: "iMobiley",
      price: "₹72,990.00",
      extracted_price: 72990,
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQmlszALU9CcE7LWZXQ8Y-aRr9r99SWLaNomc2Qomv9H0CHtLre9JdoQW_RenocLV4T-NPuofc3BzS4FZAQTJCSEkMs7SRvPu7aPNnZxrchiz-_tNNFRQY&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 50,
      title: "Renewed Apple iPhone 11 128GB White",
      link: "https://www.controlz.world/products/apple-iphone-11-renewed?variant=43942042566876&srsltid=AfmBOopMnuAZN5M-C7HqmPWcJhLavSdieoF2UMgAfXKulPQ4arXOPUazY6A",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:6390523046396895980",
      product_id: "6390523046396895980",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=6390523046396895980",
      source: "controlZ",
      price: "₹26,999.00",
      extracted_price: 26999,
      second_hand_condition: "refurbished",
      rating: 3.9,
      reviews: 25,
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRKmBcI_TympJSAEQ33NllaQPGojfMSid7DpNnu_hfBK7mjZDhmbKGDKk_6i2vF291PfNW2iLQ3ya8qbKU6E1TQvxdM9F4vExoUzD9jpNyROnTfcMAjqJSg&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 51,
      title: "Apple Iphone 11",
      link: "https://unboxyourmobile.com/Apple-iPhone-11-128GB-White?search=iphone%2011&category_id=0",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:15457984800869744910",
      product_id: "15457984800869744910",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=15457984800869744910",
      source: "Unbox Your Mobile",
      price: "₹34,900.00",
      extracted_price: 34900,
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS1KGjGgFDDVuRsbxU-m4ZxqXW8gT2K0T-T-FyRxFQEfLpHcKdsn0tzvL-SbVjhZcEGSQH3b2q4nUgXZBveP2-V1Vu71XUoHYby4rY0ezkbIv3heeIglY0U&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 52,
      title: "Apple Iphone Xr Coral, 64 Gb",
      link: "https://shop.gadgetsnow.com/refurbished-mobiles/refurbished-apple-iphone-xr-64gb-coral-3gb-ram-/10043/p_G489295",
      product_link:
        "https://www.google.co.in/shopping/product/18361906695001396405?gl=in",
      product_id: "18361906695001396405",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=18361906695001396405",
      source: "Gadgets Now",
      price: "₹37,999.00",
      extracted_price: 37999,
      second_hand_condition: "refurbished",
      rating: 4.5,
      reviews: 55804,
      extensions: ["Dual SIM", "4G", "Unlocked", "iOS"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSshCHnfn1yFlOGhQ-mzgOv6yqNXoQ7DgsHUypWVubUQzx3fZ6PURg12IzH_SbyT3bOrAaOD3GRxHob7Hgt4tFRzXZdD45GISMWJHjO9Nj_tb2jRvd-oxU0Kw&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 53,
      title: "iphone 15",
      link: "https://rkmobilecare.in/product/iphone-15/",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:9764830686313685680",
      product_id: "9764830686313685680",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=9764830686313685680",
      source: "rk mobile care jalandhar",
      price: "₹79,990.00",
      extracted_price: 79990,
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTmT7JMpFFPtANArpu0E1YCMeqA0eIpuEgRLXVjS0Lxhj2y6lcPL0Xii1aUcL-yHDY_ayQ_ONH4OYiVS62LJZaeu1QCWfB34hDkyLpt6Ow&usqp=CAE",
      delivery: "₹70.00 delivery",
    },
    {
      position: 54,
      title: "Apple iPhone 11 (128GB, Yellow)",
      link: "https://www.fliptwirls.com/shop/mobile-accessories/smart-phone-tab/apple-iphone/apple-iphone-11-128gb-yellow/?utm_source=Google+Shopping&utm_medium=cpc&utm_campaign=gmc&srsltid=AfmBOor5x5WU0LCuNjwE0vwnVGqr42SI_7ieMq4mUBoCSZi1HJgKeyDtDrY",
      product_link:
        "https://www.google.co.in/shopping/product/15224470750985629292?gl=in",
      product_id: "15224470750985629292",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=15224470750985629292",
      number_of_comparisons: "2",
      comparison_link:
        "https://www.google.co.in/shopping/product/15224470750985629292/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:2093800623912314273_0,pid:16323300718541450256,rsk:PROD_VAR_6911368388270532512&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECK4U",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A2093800623912314273_0%2Cpid%3A16323300718541450256%2Crsk%3APROD_VAR_6911368388270532512&gl=in&offers=1&product_id=15224470750985629292&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECK4U",
      source: "fliptwirls.com",
      price: "₹38,799.00",
      extracted_price: 38799,
      rating: 3.6,
      reviews: 225,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTYb3lmzV7rSrvpoBT7N2I02QJ8O0Hgepze7S3pGlJg1cLbfkLs6w-raM4ZX59wHfCD2cX0iz3czHtKs61t4IqsSlGL0B9pCgPEQflZDUrP51GhaVUG63LO&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 55,
      title: "Buy Apple iPhone 12 Mini 64GB",
      link: "https://www.triveniworld.com/products/buy-apple-iphone-12-mini-64gb?variant=47362863759657&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOoqLVFbzyUx1qLgPSqNarCPfTp_Ek3fjX7bUrPNzN3z17hOX_q4_Jb0",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:292763543855689672",
      product_id: "292763543855689672",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=292763543855689672",
      source: "Triveni World",
      price: "₹21,999.00",
      extracted_price: 21999,
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTCpnTAPTcLkPFa2QiElPU9j2KBxrZhGGp5UL3eCBTBehgDdaKJQxiPLrV1LRZdwPnQQ6y9DO8FlMW3G2CSHP_X2z8IkFonkZ6wfzvmynx7ExXgyxzpmHGM&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 56,
      title: "Apple iPhone 12 Mini - (Open Box Mobile)",
      link: "https://bestbuymobiles.in/shop/open-box-smartphones/brands/apple/apple-iphone-12-mini-open-box-mobile/?attribute_pa_color=white&attribute_pa_storage=128gb&attribute_pa_condition=good",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:1932643468651654658",
      product_id: "1932643468651654658",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=1932643468651654658",
      source: "Bestbuy Mobiles",
      price: "₹25,999.00",
      extracted_price: 25999,
      second_hand_condition: "used",
      extensions: ["Smartphone", "Single SIM", "5G"],
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSP4-BknjXtbQbJDTYlIliTgmwnnKnWix_A0B20ejDmadC-BYIgc2s5a8eUiv65udwpPS9-p3XHiaXrB_dlyQQ9FKkXTjlg7Pq0vZqMoyhL3NUn8espOJdLGg&usqp=CAE",
      delivery: "Free delivery",
    },
    {
      position: 57,
      title: "Apple iphone 11 pro max (256gb) midnight green",
      link: "https://wizekart.com/telephony/17-apple-iphone-11-pro-max-256gb-midnight-green.html?srsltid=AfmBOoofmO4eiOX5bGgldZSscL09BzbDayVP8nsdHBgVCdZrPtaTMR8gOn8&com_cvv=d30042528f072ba8a22b19c81250437cd47a2f30330f0ed03551c4efdaf3409e",
      product_link:
        "https://www.google.co.in/shopping/product/7073337746598220953?gl=in",
      product_id: "7073337746598220953",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=7073337746598220953",
      number_of_comparisons: "2",
      comparison_link:
        "https://www.google.co.in/shopping/product/7073337746598220953/offers?hl=en&q=iphone+site:amazon.in+OR+site:flipkart.in+OR+site:myntra.com&uule=w+CAIQICILRGVsaGksSW5kaWE&gl=in&prds=eto:14407356951813714388_0,pid:14893371683499230190,rsk:PROD_VAR_1981627647053547448&sa=X&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECN8U",
      serpapi_product_api_comparisons:
        "https://serpapi.com/search.json?engine=google_product&filter=eto%3A14407356951813714388_0%2Cpid%3A14893371683499230190%2Crsk%3APROD_VAR_1981627647053547448&gl=in&offers=1&product_id=7073337746598220953&sa=X&uule=w+CAIQICILRGVsaGksSW5kaWE&ved=0ahUKEwjkv6K27umDAxW8L0QIHaFMDuQQ3q4ECN8U",
      source: "WizeKart",
      price: "₹1,25,400.00",
      extracted_price: 125400,
      rating: 4.7,
      reviews: 3288,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSPv9_ELgltysuDnI6f7k_ov_xcWhFj9--oZEw4YeCvYibUKGkspzgWiZI3f8UCsu92lseCe3grzUMpy5W5OACtIqrdoRUoD2dqW5b-C8U&usqp=CAE",
      delivery: "Free delivery by 24 Jan and free 15-day returns",
    },
    {
      position: 58,
      title:
        "Buy Renewed Apple iPhone SE - Renewed - Rose Gold - 64GB/2GB - Fair by Ovantica",
      link: "https://ovantica.com/buy-refurbished-iphones/renewed-iphone-se/5128?srsltid=AfmBOory7P-QPx81d8eGqBZcgJJQ58DDDgj-rj3-ehVuYFIEadD3b2fLX3I",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:16239578200406411794",
      product_id: "16239578200406411794",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=16239578200406411794",
      source: "Ovantica.com",
      price: "₹8,900.00",
      extracted_price: 8900,
      second_hand_condition: "refurbished",
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQmaOAe7VfdNzSFCvYFRdr7QDg3JQ4vaoMP-lr5DMqb9086OzNi-VKEPSPiqFF1E6LqD0ZzjYc1d4As_7pxlmEgATdbnktJKQ&usqp=CAE",
      delivery: "Free delivery by 29 Jan and free 7-day returns",
    },
    {
      position: 59,
      title: "Apple iPhone 13 Pro (128gb) import open box",
      link: "https://cliktodeal.com/product/apple-iphone-13-pro-128gb-import-open-box/",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:15514720623473398437",
      product_id: "15514720623473398437",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=15514720623473398437",
      source: "cliktodeal",
      price: "₹65,000.00",
      extracted_price: 65000,
      extensions: ["Smartphone", "Dual SIM", "4G"],
      thumbnail:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT3TAWwgv1J29F7YYpKfHu_0Ynm7Eyaf3P5jHqByl-JitKOt2tRXciVt9WMZcK7_wpvENPaF0H8ebYMflVLcAXLGjUsrToC5MzP_sahOIQYoeUqonfS4ZHb&usqp=CAE",
      delivery: "₹450.00 delivery",
    },
    {
      position: 60,
      title: "New Apple iPhone 14 128GB Purple | Sahivalue",
      link: "https://www.sahivalue.com/products/new-apple-iphone-14-128gb-purple/293890000031774810?srsltid=AfmBOooRxeXKiMQsDUfLGdYxpYsf5a1g93dKpj8XSLRBHXHl-LTYr_6U-TA",
      product_link:
        "https://www.google.co.in/shopping/product/1?gl=in&prds=pid:4282723923997323079",
      product_id: "4282723923997323079",
      serpapi_product_api:
        "https://serpapi.com/search.json?device=desktop&engine=google_product&gl=in&google_domain=google.co.in&hl=en&location=Delhi%2C%2BIndia&product_id=4282723923997323079",
      source: "Sahivalue.com",
      price: "₹57,999.00",
      extracted_price: 57999,
      extensions: ["Smartphone", "Single SIM"],
      thumbnail:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTNiqkckOU-0C2VaamWWowbDd7YKMmuJ8snYxqwaG5LOk5Mc__fTiqn0PSXphHb1lEJlbU1PuhfYPIfLuh1S7uyR1JnnwGj&usqp=CAE",
      delivery: "Free delivery by 23 Jan and free 7-day returns",
    },
  ],
};

productRouter.get("/search", async (req, res) => {
  try {
    const query = req.query.q as string | undefined;

    if (!query) {
      return res.status(400).json({ message: "Query is required." });
    }

    const formattedQuery = formatQuery(query);
    // const productResult = await fetchProductResults(formattedQuery);
    const productRes = resu.item;

    // console.log( await fetchProductResults(query+' site:pricehistoryapp.com'))

    const responseData = filterAndMapResults(resu.item as ProductInfo[]);
    res.status(200).json({ item: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const formatQuery = (query: string): string => {
  return (
    query.replace(" ", "+").toLowerCase() +
    " site:" +
    allowedDomains.join(" OR site:")
  );
};

const fetchProductResults = async (formattedQuery: string) => {
  return await getJson({
    q: formattedQuery,
    location: LOCATION,
    google_domain: "google.co.in",
    api_key: process.env.SERPAPI_API,
    engine: "google_shopping",
    gl: "in",
    hl: "en",
    site:'pricehistoryapp.com'
  }) as { shopping_results: ProductInfo[] };
};

const filterAndMapResults = (productResult: ProductInfo[]): ProductInfo[] => {
  return productResult.filter((item) => {
    const domain = item.link.match(domainRegex);
    return domain && allowedDomains.includes(domain[1]);
  });
};

productRouter.post("/pin", async (req, res) => {
  try {
    let userId= req.body.userId;
    //check user is logged in
    // const token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    // const decodedToken = jwt.verify(
    //   token,
    //   process.env.JWT_SECRET ?? ""
    // ) as jwt.JwtPayload;
    // if (!decodedToken) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    // const userId = decodedToken.userId;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const url = req.body.url as string | undefined;
    const price = req.body.price as number | undefined;
    if (!url) {
      return res.status(400).json({ message: "Pin is required" });
    }

    user.pinned.push({
      id: url,
      price: 0,
    });

    user.save();

    const isAlreadyPinned = await PinnedModel.findOne({ productId: url });

    if (isAlreadyPinned) {
      isAlreadyPinned.userId.push(userId);
      isAlreadyPinned.save();
      res.status(200).json({ pinned: true });
      return;
    }
    const pinned = new PinnedModel({
      productId: url,
      userId: [userId],
    });

    pinned.save();

    res.status(200).json({ pinned: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

productRouter.post("/price-change", async (req, res) => {
  try {
    const pinned = await PinnedModel.find();

    const latestPrices = req.body.data as
      | { url: string; data: { price: number; time: number } }[]
      | undefined;

    if (!latestPrices) {
      return res.status(400).json({ message: "data is required" });
    }

    latestPrices.forEach(async (item) => {
      const url = item.url;
      const price = item.data.price;
      const pinnedItems = pinned.filter((item) => item.productId === url);
      if (!pinnedItems) {
        return;
      }
      pinnedItems.forEach((pinnedItem) => {
        pinnedItem.userId.forEach(async (userId) => {
          const user = await User.findById(userId);
          if (!user) {
            return;
          }
          sendMail(
            user,
            `<p>Price of ${url} has changed to ${price}</p>`,
            "Price Change",
            (err, info) => {
              if (err) {
                console.error(err);
              } else {
                console.log(info);
              }
            }
          );
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default productRouter;
