import React from 'react';
import Modal from '../component-library/Modal';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Globals from '../component-library/Globals';
import CloseIcon from '../component-library/icons/CloseIcon';

interface Props {
  showAgreementModal: boolean;
  toggleAgreementModal: Function;
  onClosed: () => void;
  type?: string;
}

export default class AgreementsModal extends React.Component<Props> {
  render() {
    return (
      <Modal
        key="agreementsModal"
        modalheightType={'modal1'}
        placement={'bottom'}
        isVisible={this.props.showAgreementModal}
        onClosed={() => this.props.onClosed()}>
        <ScrollView style={styles.modalContentContainer}>
          {this.displayAgreementType()}
        </ScrollView>
      </Modal>
    );
  }

  customeHeader = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.headerCenter}>{this.props.type}</Text>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => this.props.toggleAgreementModal()}
          hitSlop={hitsloop}>
          <CloseIcon color={Globals.color.brand.neutral1} width={15.5} />
        </TouchableOpacity>
      </View>
    );
  };

  displayAgreementType = () => {
    const { type } = this.props;
    switch (type) {
      case 'Terms & Conditions':
        return <View>{this.renderTermsAndConditions()}</View>;
      case 'Privacy Policy':
        return <View>{this.renderPrivacyPolicy()}</View>;
      case 'Cookie Policy':
        return <View>{this.renderCookiePolicy()}</View>;
      case 'Community Guidelines':
        return <View>{this.renderCommunityGuidelines()}</View>;
    }
  };

  renderCookiePolicy = () => {
    return (
      <Text style={styles.modalContentText}>
        <Text style={styles.boldText}>Introduction</Text>
        {'\n'}
        Youpendo is committed to protecting your privacy. We aim to provide
        trustworthy, industry-leading products and services so that you can
        focus on building meaningful connections. Our approach to privacy is to
        provide you with clear information about our data practices. That’s why
        we've tried to keep legal and technical jargon to a minimum. This Cookie
        Policy explains what cookies are, what types of cookies are placed on
        your device when you visit our website and how we use them. This Cookie
        Policy does not address how we deal with your personal information
        generally. To learn more about how we process your personal information,
        please see our Privacy Policy.
        {'\n'}
        <Text style={styles.boldText}>What are cookies?</Text>
        {'\n'}
        Cookies are small text files that are sent to or accessed from your web
        browser or your device’s memory.  A cookie typically contains the name
        of the domain (internet location) from which the cookie originated, the
        “lifetime” of the cookie (i.e., when it expires) and a randomly
        generated unique number or similar identifier. A cookie also may contain
        information about your device, such as user settings, browsing history
        and activities conducted while using our services.
        {'\n'}
        <Text style={styles.boldText}>
          Are there different types of cookies?
        </Text>
        {'\n'}
        <Text style={styles.boldText}>First-party and third-party cookies</Text>
        {'\n'}
        There are first-party cookies and third-party cookies. First-party
        cookies are placed on your device directly by us. For example, we use
        first-party cookies to adapt our website to your browser’s language
        preferences and to better understand your use of our website.
        Third-party cookies are placed on your device by our partners and
        service providers. For example, we use third-party cookies to measure
        user numbers on our website or to enable you to share content with
        others across social media platforms.
        {'\n'}
        <Text style={styles.boldText}>Session and persistent cookies</Text>
        {'\n'}
        There are session cookies and persistent cookies. Session cookies only
        last until you close your browser. We use session cookies for a variety
        of reasons, including to learn more about your use of our website during
        one single browser session and to help you to use our website more
        efficiently. Persistent cookies have a longer lifespan and aren't
        automatically deleted when you close your browser. These types of
        cookies are primarily used to help you quickly sign-in to our website
        again and for analytical purposes.
        {'\n'}
        <Text style={styles.boldText}>
          What about other tracking technologies, like web beacons?
        </Text>
        {'\n'}
        Other technologies such as web beacons (also calls pixel tags or clear
        gifs), tracking URLs or software development kits (SDKs) are used for
        similar purposes. Web beacons are tiny graphics files that contain a
        unique identifier that enable us to recognise when someone has visited
        our service or opened an e-mail that we have sent them.  Tracking URLs
        are custom generated links that help us understand where the traffic to
        our webpages comes from. SDKs are small pieces of code included in apps,
        which function like cookies and web beacons. For simplicity, we also
        refer to these technologies as “cookies” in this Cookie Policy.
        {'\n'}
        <Text style={styles.boldText}>What do we use cookies for?</Text>
        {'\n'}
        Like most providers of online services, we use cookies to provide,
        secure and improve our services, including by remembering your
        preferences, recognizing you when you visit our website and
        personalizing and tailoring ads to your interests. To accomplish these
        purposes, we also may link information from cookies with other personal
        information we hold about you. When you visit our website, some or all
        of the following types of cookies may be set on your device.
        {'\n'}
        <Text style={styles.boldText}>Essential website cookies</Text>
        {'\n'}
        These cookies are strictly necessary to provide you with services
        available through our website and to use some of its features, such as
        access to secure areas.
        {'\n'}
        <Text style={styles.boldText}>Analytics cookies</Text>
        {'\n'}
        These cookies help us understand how our website is being used, how
        effective marketing campaigns are, and help us customize and improve our
        websites for you.
        {'\n'}
        <Text style={styles.boldText}>Advertising cookies</Text>
        {'\n'}
        These cookies are used to make advertising messages more relevant to
        you.  They perform functions like preventing the same ad from
        continuously reappearing, ensuring that ads are properly displayed for
        advertisers, selecting advertisements that are based on your interests
        and measuring the number of ads displayed and their performance, such as
        how many people clicked on a given ad.
        {'\n'}
        <Text style={styles.boldText}>Social networking cookies</Text>
        These cookies are used to enable you to share pages and content that you
        find interesting on our website through third-party social networking
        and other websites.  These cookies may also be used for advertising
        purposes too.
        {'\n'}
        <Text style={styles.boldText}>How can you control cookies?</Text>
        {'\n'}
        There are several cookie management options available to you. Please
        note that changes you make to your cookie preferences may make browsing
        our website a less satisfying experience. In some cases, you may even
        find yourself unable to use all or part of our site.
        {'\n'}
        <Text style={styles.boldText}>Browser and devices controls</Text>
        {'\n'}
        Some web browsers provide settings that allow you to control or reject
        cookies or to alert you when a cookie is placed on your computer.  The
        procedure for managing cookies is slightly different for each internet
        browser. You can check the specific steps in your particular browser
        help menu. You also may be able to reset device identifiers by
        activating the appropriate setting on your mobile device. The procedure
        for managing device identifiers is slightly different for each device.
        You can check the specific steps in the help or settings menu of your
        particular device.
        {'\n'}
        <Text style={styles.boldText}>Interest-based advertising tools</Text>
        {'\n'}
        You can opt out of seeing online interest-based advertising from
        participating companies through the Digital Advertising Alliance,
        the Interactive Digital Advertising Alliance or Appchoices (apps only).
        Opting out does not mean you will not see advertising - it means you
        won’t see personalized advertising from the companies that participate
        in the opt-out programs.  Also, if you delete cookies on your device
        after you opted out, you will need to opt-out again.
        {'\n'}
        <Text style={styles.boldText}>Social Cookies</Text>
        {'\n'}
        To allow you to share content on social media, some features of this
        website use social media plug-ins (e.g., Twitter™ “Share to Twitter” or
        LinkedIn™ “in” buttons). Depending on your social media account
        settings, we automatically receive information from the social media
        platform when you use the corresponding button on our website. To learn
        more about social media cookies, we suggest you refer to your social
        media platform’s cookie policy and privacy policy.
        {'\n'}
        <Text style={styles.boldText}>Google™ Cookies</Text>
        {'\n'}
        Stuff Google Wants to Make Sure You Know about Google’s Data Collection
        Technology.
        {'\n'}
        <Text style={styles.boldText}>Google™ Maps API Cookies</Text>
        {'\n'}
        Some features of our website and some Youpendo services rely on the use
        of Google™ Maps API Cookies. Such cookies will be stored on your device.
        When browsing this website and using the services relying on Google™
        Maps API cookies, you consent to the storage, collection of such cookies
        on your device and to the access, usage and sharing by Google of the
        data collected thereby. Google™ manages the information and your choices
        pertaining to Google™ Maps API Cookies via an interface separate from
        that supplied by your browser. For more information, please
        see https://www.google.com/policies/technologies/cookies/.
        {'\n'}
        <Text style={styles.boldText}>Google Analytics</Text>
        {'\n'}
        We use Google Analytics, which is a Google service that uses cookies and
        other data collection technologies to collect information about your use
        of the website and services in order to report website trends. You can
        opt out of Google Analytics by visiting www.google.com/settings/ads or
        by downloading the Google Analytics opt-out browser add-on
        at https://tools.google.com/dlpage/gaoptout.
        {'\n'}
        <Text style={styles.boldText}>How to contact us?</Text>
        {'\n'}
        If you have questions about this Cookie Policy, here’s how you can reach
        us: artur.zvinchuk@i22.de
        {'\n'}
        Youpendo GmbH
        {'\n'}
        Youpendo
        {'\n'}
        Friedrich-Breuer Strasse 19
        {'\n'}
        53225 Bonn
        {'\n'}
        Germany
        {'\n'}
      </Text>
    );
  };

  renderPrivacyPolicy = () => {
    return (
      <Text style={styles.modalContentText}>
        <Text style={styles.boldText}>Our Commitment To You</Text>
        {'\n'}
        At Youpendo, your privacy is a top priority.Your privacy is at the core
        of the way we design and build the services and products you know and
        love, so that you can fully trust them and focus on building meaningful
        interactions and connections. We appreciate that you put your trust in
        us when you provide us with your information, and we do not take this
        lightly. We do not compromise with your privacy.We design all of our
        products and services with your privacy in mind.We involve experts from
        various fields, including legal, security, engineering, product design
        and others to make sure that no decision is taken without respect for
        your privacy. We strive to be transparent in the way we process your
        data.Because we use many of the same online services you do, we know
        that insufficient information and overly complicated language are common
        issues in privacy policies.We take the exact opposite approach: we have
        written our Privacy Policy and related documents in plain language.We
        actually want you to read our policies and understand our privacy
        practices! We work hard to keep your information secure We have teams
        dedicated to keeping your data safe and secure.We constantly update our
        security practices and invest in our security efforts to enhance the
        safety of your information.
        {'\n'}
        <Text style={styles.boldText}>Privacy Policy</Text>
        {'\n'}
        Welcome to Youpendo’s Privacy Policy.Thank you for taking the time to
        read it. We appreciate that you trust us with your information, and we
        intend to always keep that trust.This starts with making sure you
        understand the information we collect, why we collect it, how it is used
        and your choices regarding your information.This Policy describes our
        privacy practices in plain language, keeping legal and technical jargon
        to a minimum. This Privacy Policy applies beginning January 17, 2020.
        {'\n'}
        <Text style={styles.boldText}>Effective Date: January 17, 2020 </Text>
        {'\n'}
        1. WHO WE ARE
        {'\n'}
        2. WHERE THIS PRIVACY POLICY APPLIES
        {'\n'}
        3. INFORMATION WE COLLECT
        {'\n'}
        4. COOKIES AND OTHER SIMILAR DATA COLLECTION TECHNOLOGIES
        {'\n'}
        5. HOW WE USE INFORMATION
        {'\n'}
        6. HOW WE SHARE INFORMATION
        {'\n'}
        7. YOUR RIGHTS
        {'\n'}
        8. HOW WE PROTECT YOUR INFORMATION
        {'\n'}
        9. HOW LONG WE RETAIN YOUR INFORMATION
        {'\n'}
        10. CHILDREN’S PRIVACY
        {'\n'}
        11. PRIVACY POLICY CHANGES
        {'\n'}
        12. HOW TO CONTACT US
        {'\n'}
        1. WHO WE ARE
        {'\n'}
        If you live in the European Union, the company that is responsible for
        your information under this Privacy Policy(the “data controller”) is:
        {'\n'}
        <Text style={styles.boldText}>Youpendo GmbH</Text>
        {'\n'}
        Youpendo
        {'\n'}
        Friedrich - Breuer Strasse 19
        {'\n'}
        53225 Bonn
        {'\n'}
        Germany
        {'\n'}
        <Text style={styles.boldText}>
          2. Where This Privacy Policy Applies
        </Text>
        {'\n'}
        This Privacy Policy applies to websites, apps, events and other services
        we operate the brand, Youpendo.For simplicity, we refer to all of these
        as our “services” in this Privacy Policy.To make it clear, we’ve added
        links to this Privacy Policy on all applicable services. Some services
        may require their own unique privacy policy.If a particular service has
        its own privacy policy, then that policy-- not this Privacy Policy
        applies.
        {'\n'}
        <Text style={styles.boldText}>3. Information We Collect</Text>
        {'\n'}
        It goes without saying, we can’t help you develop meaningful
        interactions without some information about you, such as basic profile
        details.We also collect information generated as you use our services,
        for example, access logs, as well as information from third parties,
        like when you access our services through a social media account.If you
        want additional info, we go into more detail below.
        {'\n'}
        <Text style={styles.boldText}>Information you give us</Text>
        {'\n'}
        You choose to give us certain information when using our services.This
        includes: When you create an account, you provide us with at least your
        login credentials, as well as some basic details necessary for the
        service to work, such as your name. When you complete your profile, you
        can share with us additional information, such as photos.To add certain
        content, like pictures, you may allow us to access your camera or photo
        album.Some of the information you choose to provide us may be considered
        “special” or “sensitive” in certain jurisdictions, for example, your
        racial or ethnic origins, sexual orientation, and religious beliefs.By
        choosing to provide this information, you consent to our processing of
        that information. When you participate in surveys or focus groups, you
        give us your insights into our products and services, responses to our
        questions and testimonials. When you choose to participate in our
        promotions, events or contests, we collect the information that you use
        to register or enter. If you ask us to communicate with or otherwise
        process information of other people(for example, if you ask us to send
        an email on your behalf to one of your friends), we collect the
        information about others that you give us in order to complete your
        request. Of course, we also process your text conversations with other
        users as well as the content you publish, as part of the operation of
        the services. Information we receive from others In addition to the
        information you provide us directly, we receive information about you
        from others, including:
        {'\n'}
        <Text style={styles.boldText}>Other Users</Text>
        {'\n'}
        Other users may provide information about you as they use our
        services.For instance, we may collect information about you from other
        users if they contact us about you.
        {'\n'}
        <Text style={styles.boldText}>Social Media</Text>
        {'\n'}
        You may be able to use your social media login(such as Facebook Login)
        to create and log into your Youpendo account.This saves you from having
        to remember yet another user name and password and allows you to share
        some information from your social media account with us.
        {'\n'}
        <Text style={styles.boldText}>Other Partners</Text>
        {'\n'}
        We may receive info about you from our partners, for instance when
        Youpendo accounts can be created through a partner’s websites(in which
        case they pass along registration information to us) or where Youpendo
        ads are published on a partner’s websites and platforms(in which case
        they may pass along details on a campaign’s success).
        {'\n'}
        <Text style={styles.boldText}>
          Information collected when you use our services
        </Text>
        {'\n'}
        When you use our services, we collect information about which features
        you’ve used, how you’ve used them and the devices you use to access our
        services.See below for more details:
        {'\n'}
        <Text style={styles.boldText}>Usage Information</Text>
        {'\n'}
        We collect information about your activity on our services, for instance
        how you use them(e.g., date and time you logged in, features you’ve been
        using, searches, clicks and pages which have been shown to you,
        referring webpage address, advertising that you click on) and how you
        interact with other users(e.g., users you connect and interact with,
        time and date of your exchanges, number of messages you send and
        receive).
        {'\n'}
        <Text style={styles.boldText}>Device information</Text>
        {'\n'}
        We collect information from and about the device(s) you use to access
        our services, including: hardware and software information such as IP
        address, device ID and type, device - specific and apps settings and
        characteristics, app crashes, advertising IDs(such as Google’s AAID and
        Apple's IDFA, both of which are randomly generated numbers that you can
        reset by going into your device’ settings), browser type, version and
        language, operating system, time zones, identifiers associated with
        cookies or other technologies that may uniquely identify your device or
        browser (e.g., IMEI/UDID and MAC address); information on your wireless
        and mobile network connection, like your service provider and signal
        strength; information on device sensors such as accelerometers,
        gyroscopes and compasses.
        {'\n'}
        <Text style={styles.boldText}>Other information with your consent</Text>
        {'\n'}
        If you give us permission, we can collect your precise
        geolocation(latitude and longitude) in order to offer you features that
        make use of it.Such geolocation is collected through various means,
        depending on the service and device you’re using, including GPS,
        Bluetooth or Wi - Fi connections.The collection of your geolocation may
        occur in the background even when you aren’t using the services if the
        permission you gave us expressly permits such collection.If you decline
        permission for us to collect your geolocation, we will not collect it.
        Similarly, if you consent, we may collect your photos and videos(for
        instance, if you want to publish a photo, video on the services).We may
        also collect your phone book(for instance, if you want us to reach out
        to your friends on your behalf).
        {'\n'}
        <Text style={styles.boldText}>
          4. Cookies And Other Similiar Data Collection Technologies
        </Text>
        {'\n'}
        We use and may allow others to use cookies and similar
        technologies(e.g., web beacons, pixels) to recognize you and / or your
        device(s).You may read our Cookie Policy for more information on why we
        use them(such as authenticating you, remembering your preferences and
        settings, analyzing site traffic and trends, delivering and measuring
        the effectiveness of advertising campaigns, allowing you to use social
        features) and how you can better control their use, through your browser
        settings and other tools. Some web browsers(including Safari, Internet
        Explorer, Firefox and Chrome) have a “Do Not Track” (“DNT”) feature that
        tells a website that a user does not want to have his or her online
        activity tracked.If a website that responds to a DNT signal receives a
        DNT signal, the browser can block that website from collecting certain
        information about the browser’s user.Not all browsers offer a DNT option
        and DNT signals are not yet uniform.For this reason, many businesses,
        including Youpendo, do not currently respond to DNT signals.
        {'\n'}
        <Text style={styles.boldText}>5. How We Use Information</Text>
        {'\n'}
        The main reason we use your information is to deliver and improve our
        services.Additionally, we use your info to help keep you safe and to
        provide you with advertising that may be of interest to you.Read on for
        a more detailed explanation of the various reasons we use your
        information, together with practical examples.
        {'\n'}
        To administer your account and provide our services to you
        {'\n'}
        Create and manage your account
        {'\n'}
        Provide you with customer support and respond to your requests
        {'\n'}
        Communicate with you about our services
        {'\n'}
        To help you connect with other users
        {'\n'}
        Analyze your profile, activity on the service, and preferences to
        recommend meaningful connections to you and recommend you to others.
        {'\n'}
        Show user profiles and paper planes to one another
        {'\n'}
        To ensure a consistent experience across your devices
        {'\n'}
        Link the various devices you use so that you can enjoy a consistent
        experience of our services on all of them.We do this by linking devices
        and browser data, such as when you log into your account on different
        devices or by using partial or full IP address, browser version and
        similar data about your devices to help identify and link them.
        {'\n'}
        To provide new Youpendo services to you
        {'\n'}
        Register you and display your profile on new Youpendo features and apps
        {'\n'}
        Administer your account on these new features and apps
        {'\n'}
        To serve you relevant offers
        {'\n'}
        Communicate with you by email, phone, social media or mobile device
        about products or services that we think may interest you
        {'\n'}
        Develop, display and track content tailored to your interests on our
        services and other sites
        {'\n'}
        To improve our services and develop new ones
        {'\n'}
        Administer focus groups and surveys
        {'\n'}
        Conduct research and analysis of users’ behavior to improve our services
        and content(for instance, we may decide to change the look and feel or
        even substantially modify a given feature based on users’ behavior)
        {'\n'}
        Develop new features and services(for example, we may decide to build a
        new interests - based feature further to requests received from users).
        {'\n'}
        To prevent, detect and fight fraud or other illegal or unauthorized
        activities
        {'\n'}
        Address ongoing or alleged misbehavior on and off - platform
        {'\n'}
        Perform data analysis to better understand and design countermeasures
        against these activities
        {'\n'}
        Retain data related to fraudulent activities to prevent against
        recurrences
        {'\n'}
        To ensure legal compliance
        {'\n'}
        Comply with legal requirements
        {'\n'}
        Assist law enforcement
        {'\n'}
        Enforce or exercise our rights, for example the ones laid out in our
        Terms
        {'\n'}
        To process your information as described above, we rely on the following
        legal bases:
        {'\n'}
        Provide our service to you: Most of the time, the reason we process your
        information is to perform the contract that you have with us.For
        instance, as you go about using our service to build meaningful
        interactions and connections, we use your information to maintain your
        account and your profile, to make it viewable to other users
        {'\n'}
        Legitimate interests: We may use your information where we have
        legitimate interests to do so.For instance, we analyze users’ behavior
        on our services to continuously improve our offerings, we suggest offers
        we think might interest you, and we process information for
        administrative, fraud detection and other legal purposes.
        {'\n'}
        Consent: From time to time, we may ask for your consent to use your
        information for certain specific reasons.You may withdraw your consent
        at any time by contacting us at the address provided at the end of this
        Privacy Policy.
        {'\n'}
        <Text style={styles.boldText}>6. How We Share Information</Text>
        {'\n'}
        Since our goal is to help you make meaningful interactions and
        connections, the main sharing of users’ information is, of course, with
        other people, as per your confidentially settings.We also share some
        users’ information with service providers and partners who assist us in
        operating the services, and in some cases legal authorities.Read on for
        more information about how your information is shared with others.
        {'\n'}
        <Text style={styles.boldText}>· With other users</Text>
        {'\n'}
        We share your information with other users(and in the case of any
        sharing features available on Youpendo, with the individuals or apps you
        may choose to share your information with) when you voluntarily disclose
        information on the service(including your public profile).Please be
        careful with your information and make sure that the content you share
        is stuff that you’re comfortable being publically viewable since neither
        you nor we can control what others do with your information once you
        share it. If you choose to limit the audience for all or part of your
        profile or for certain content or information about you, then it will be
        visible according to your settings.
        {'\n'}
        <Text style={styles.boldText}>
          · With our service providers and partners
        </Text>
        {'\n'}
        We use third parties to help us operate and improve our services.These
        third parties assist us with various tasks, including data hosting and
        maintenance, analytics, customer care, marketing, advertising, payment
        processing and security operations.
        {'\n'}
        We may also share information with partners who distribute and assist us
        in advertising our services.For instance, we may share limited -
        information on you in hashed, non - human readable form to advertising
        partners.
        {'\n'}
        We follow a strict vetting process prior to engaging any service
        provider or working with any partner.All of our service providers and
        partners must agree to strict confidentially obligations.
        {'\n'}
        <Text style={styles.boldText}>· For corporate transactions</Text>
        {'\n'}
        We may transfer your information if we are involved, whether in whole or
        in part, in a merger, sale, acquisition, divestiture, restructuring,
        reorganization, dissolution, bankruptcy or other change of ownership or
        control.
        {'\n'}
        <Text style={styles.boldText}>· When required by law</Text>
        {'\n'}
        We may disclose your information if reasonably necessary: (i) to comply
        with a legal process, such as a court order, subpoena or search warrant,
        government / law enforcement investigation or other legal requirements;
        (ii) to assist in the prevention or detection of crime(subject in each
        case to applicable law); or(iii) to protect the safety of any person.
        {'\n'}
        <Text style={styles.boldText}>· To enforce legal rights</Text>
        {'\n'}
        We may also share information: (i) if disclosure would mitigate our
        liability in an actual or threatened lawsuit; (ii) as necessary to
        protect our legal rights and legal rights of our users, business
        partners or other interested parties; (iii) to enforce our agreements
        with you; and(iv) to investigate, prevent, or take other action
        regarding illegal activity, suspected fraud or other wrongdoing.
        {'\n'}
        <Text style={styles.boldText}>
          · With your consent or at your request
        </Text>
        {'\n'}
        We may ask for your consent to share your information with third
        parties.In any such case, we will make it clear why we want to share the
        information.
        {'\n'}
        We may use and share non - personal information(meaning information
        that, by itself, does not identify who you are such as device
        information, general demographics, general behavioral data, geolocation
        in de - identified form), as well as personal information in hashed, non
        - human readable form, under any of the above circumstances.We may also
        share this information with other Match Group companies and third
        parties(notably advertisers) to develop and deliver targeted advertising
        on our services and on websites or applications of third parties, and to
        analyze and report on advertising you see.We may combine this
        information with additional non - personal information or personal
        information in hashed, non - human readable form collected from other
        sources.More information on our use of cookies and similar technologies
        can be found in our Cookie Policy
        {'\n'}
        <Text style={styles.boldText}>7. Your Rights</Text>
        {'\n'}
        We want you to be in control of your information, so we have provided
        you with the following tools:
        {'\n'}
        Device permissions.Mobile platforms have permission systems for specific
        types of device data and notifications, such as phone book and location
        services as well as push notifications.You can change your settings on
        your device to either consent or oppose the collection of the
        corresponding information or the display of the corresponding
        notifications.Of course, if you do that, certain services may lose full
        functionality. Deletion.You can delete your account and information by
        using the corresponding functionality directly on the service. We want
        you to be aware of your privacy rights.Here are a few key points to
        remember: Reviewing your information.
        {'\n'}
        Applicable privacy laws may give you the right to review the personal
        information we keep about you(depending on the jurisdiction, this may be
        called right of access, right of portability, or variation of those
        terms).You can request a copy of your personal information by putting in
        such a request at artur.zvinchuk@i22.de Updating your information.If you
        believe that the information we hold about you is inaccurate or that we
        are no longer entitled to use it and want to request its rectification,
        deletion or object to its processing, please contact us at
        artur.zvinchuk@i22.de. For your protection and the protection of all of
        our users, we may ask you to provide proof of identity before we can
        answer the above requests. Keep in mind, we may reject requests for
        certain reasons, including if the request is unlawful or if it may
        infringe on trade secrets or intellectual property or the privacy of
        another user.If you wish to receive information relating to another
        user, such as a copy of any messages you received from him or her
        through our service, the other user will have to contact our Privacy
        Officer to provide their written consent before the information is
        released. Also, we may not be able to accommodate certain requests to
        object to the processing of personal information, notably where such
        requests would not allow us to provide our service to you anymore.
        Uninstall.You can stop all information collection by an app by
        uninstalling it using the standard uninstall process for your device.If
        you uninstall the app from your mobile device, the unique identifier
        associated with your device will continue to be stored.If you re -
        install the application on the same mobile device, we will be able to re
        - associate this identifier to your previous transactions and
        activities. Accountability.In certain countries, including in the
        European Union, you have a right to lodge a complaint with the
        appropriate data protection authority if you have concerns about how we
        process your personal information.The data protection authority you can
        lodge a complaint with notably may be that of your habitual residence,
        where you work or where we are established.
        {'\n'}
        <Text style={styles.boldText}>8. How We Protect Your Information</Text>
        {'\n'}
        We work hard to protect you from unauthorized access to or alteration,
        disclosure or destruction of your personal information.As with all
        technology companies, although we take steps to secure your information,
        we do not promise, and you should not expect, that your personal
        information will always remain secure. We regularly monitor our systems
        for possible vulnerabilities and attacks and regularly review our
        information collection, storage and processing practices to update our
        physical, technical and organizational security measures. We may suspend
        your use of all or part of the services without notice if we suspect or
        detect any breach of security.If you believe that your account or
        information is no longer secure, please notify us immediately at
        artur.zvinchuk@i22.de
        {'\n'}
        <Text style={styles.boldText}>
          9. How Long We Retain Your Information
        </Text>
        {'\n'}
        We keep your personal information only as long as we need it for
        legitimate business purposes(as laid out in Section 5) and as permitted
        by applicable law.To protect the safety and security of our users on and
        off our services, we implement a safety retention window of three months
        following account deletion.During this period, account information will
        be retained although the account will of course not be visible on the
        services anymore. In practice, we delete or anonymize your information
        upon deletion of your account(following the safety retention window) or
        after two years of continuous inactivity, [AZ2] unless: we must keep it
        to comply with applicable law(for instance, some “traffic data” is kept
        for one year to comply with statutory data retention obligations); we
        must keep it to evidence our compliance with applicable law(for
        instance, records of consents to our Terms, Privacy Policy and other
        similar consents are kept for five years); there is an outstanding
        issue, claim or dispute requiring us to keep the relevant information
        until it is resolved; or the information must be kept for our legitimate
        business interests, such as fraud prevention and enhancing users' safety
        and security. For example, information may need to be kept to prevent a
        user who was banned for unsafe behavior or security incidents from
        opening a new account. Keep in mind that even though our systems are
        designed to carry out data deletion processes according to the above
        guidelines, we cannot promise that all data will be deleted within a
        specific timeframe due to technical constraints.
        {'\n'}
        <Text style={styles.boldText}>10. Children's Privacy</Text>
        {'\n'}
        Our services are restricted to users who are 18 years of age or older.We
        do not permit users under the age of 18 on our platform and we do not
        knowingly collect personal information from anyone under the age of 18.
        If you suspect that a user is under the age of 18, please use the
        reporting mechanism available through the service.
        {'\n'}
        <Text style={styles.boldText}>11. Privacy Policy Changes</Text>
        {'\n'}
        Because we’re always looking for new and innovative ways to help you
        build meaningful interactions and connections, this policy may change
        over time.We will notify you before any material changes take effect so
        that you have time to review the changes.
        {'\n'}
        <Text style={styles.boldText}>12. How To Contact Us</Text>
        {'\n'}
        If you have questions about this Privacy Policy, here’s how you can
        reach us:
        {'\n'}
        Youpendo GmbH
        {'\n'}
        Youpendo
        {'\n'}
        Friedrich - Breuer Strasse 19
        {'\n'}
        53225 Bonn
        {'\n'}
        Germany
        {'\n'}
        Email: artur.zvinchuk@i22.de
      </Text>
    );
  };

  renderTermsAndConditions = () => {
    return (
      <Text style={styles.modalContentText}>
        <Text style={styles.boldText}>Terms Of Use</Text>
        {'\n'}
        Last revised on January, 17 2020
        {'\n'}
        Welcome to Youpendo, operated by Youpendo GmbH (“us,” “we,” the
        “Company” or “Youpendo”).
        {'\n'}
        <Text style={styles.boldText}>
          1. Acceptance of Terms of Use Agreement.
        </Text>
        {'\n'}
        By creating a Youpendo account or by using any Youpendo service, whether
        through a mobile device or mobile application or computer you agree to
        be bound by (i) these Terms of Use, (ii) our Privacy Policy and
        Community Guidelines, each of which is incorporated by reference into
        this Agreement, and (iii) any terms disclosed to you if you purchase or
        have purchased additional features, products or services we offer on the
        Service (collectively, this “Agreement”). If you do not accept and agree
        to be bound by all of the terms of this Agreement (other than the
        limited one-time opt-out right for certain users provided for in Section
        15), you should not use the Service. We may make changes to this
        Agreement and to the Service from time to time. We may do this for a
        variety of reasons including to reflect changes in or requirements of
        the law, new features, or changes in business practices. The most recent
        version of this Agreement will be posted on the Service under Settings
        and also on Youpendo.com, and you should regularly check for the most
        recent version. The most recent version is the version that applies. If
        the changes include material changes that affect your rights or
        obligations, we will notify you in advance of the changes by reasonable
        means, which could include notification through the Service or via
        email. If you continue to use the Service after the changes become
        effective, then you agree to the revised Agreement. You agree that this
        Agreement shall supersede any prior agreements (except as specifically
        stated herein), and shall govern your entire relationship with Youpendo,
        including but not limited to events, agreements, and conduct preceding
        your acceptance of this Agreement.
        {'\n'}
        <Text style={styles.boldText}>2. Eligibility.</Text>
        {'\n'}
        You must be at least 18 years of age to create an account on Youpendo
        and use the Service. By creating an account and using the Service, you
        represent and warrant that: you can form a binding contract with
        Youpendo, you will comply with this Agreement and all applicable local,
        state, national and international laws, rules and regulations, and you
        have never been convicted of or pled no contest to a felony, a sex
        crime, or any crime involving violence, and that you are not required to
        register as a sex offender with any state, federal or local sex offender
        registry.
        {'\n'}
        <Text style={styles.boldText}>3. Your Account.</Text>
        {'\n'}
        In order to use Youpendo, you may sign in using your Facebook login.  If
        you do so, you authorize us to access and use certain Facebook account
        information, including but not limited to your public Facebook profile
        and information about Facebook friends you share in common with other
        Youpendo users. For more information regarding the information we
        collect from you and how we use it, please consult our Privacy Policy .
        You are responsible for maintaining the confidentiality of your login
        credentials you use to sign up for Youpendo, and you are solely
        responsible for all activities that occur under those credentials. If
        you think someone has gained access to your account, please immediately
        contact us at artur.zvinchuk@i22.de
        {'\n'}
        <Text style={styles.boldText}>
          4. Modifying the Service and Termination.
        </Text>
        {'\n'}
        Youpendo is always striving to improve the Service and bring you
        additional functionality that you will find engaging and useful. This
        means we may add new product features or enhancements from time to time
        as well as remove some features, and if these actions do not materially
        affect your rights or obligations, we may not provide you with notice
        before taking them. We may even suspend the Service entirely, in which
        event we will notify you in advance unless extenuating circumstances,
        such as safety or security concerns, prevent us from doing so. You may
        terminate your account at any time, for any reason, by following the
        instructions in “Settings” in the Service. Youpendo may terminate your
        account at any time without notice if it believes that you have violated
        this Agreement. Upon such termination, you will not be entitled to any
        refund for purchases. After your account is terminated, this Agreement
        will terminate, except that the following provisions will still apply to
        you and Youpendo: Section 4, Section 5, and Sections 11 through 16.
        {'\n'}
        <Text style={styles.boldText}>
          5. Safety; Your Interactions with Other Users.
        </Text>
        You agree that you will not provide your financial information (for
        example, your credit card or bank account information), or wire or
        otherwise send money, to other users .
        {'\n'}
        YOU ARE SOLELY RESPONSIBLE FOR YOUR INTERACTIONS WITH OTHER USERS. YOU
        UNDERSTAND THAT YOUPENDO DOES NOT CONDUCT CRIMINAL BACKGROUND CHECKS ON
        ITS USERS OR OTHERWISE INQUIRE INTO THE BACKGROUND OF ITS USERS.
        YOUPENDO MAKES NO REPRESENTATIONS OR WARRANTIES AS TO THE CONDUCT OF
        USERS. YOUPENDO RESERVES THE RIGHT TO CONDUCT – AND YOU AGREE THAT
        YOUPENDO MAY CONDUCT - ANY CRIMINAL BACKGROUND CHECK OR OTHER SCREENINGS
        (SUCH AS SEX OFFENDER REGISTER SEARCHES) AT ANY TIME USING AVAILABLE
        PUBLIC RECORDS.
        {'\n'}
        <Text style={styles.boldText}>6. Rights Youpendo Grants You.</Text>
        {'\n'}
        Youpendo grants you a personal, worldwide, royalty-free, non-assignable,
        nonexclusive, revocable, and non-sublicensable license to access and use
        the Service. This license is for the sole purpose of letting you use and
        enjoy the Service’s benefits as intended by Youpendo and permitted by
        this Agreement. Therefore, you agree not to: use the Service or any
        content contained in the Service for any commercial purposes without our
        written consent. copy, modify, transmit, create any derivative works
        from, make use of, or reproduce in any way any copyrighted material,
        images, trademarks, trade names, service marks, or other intellectual
        property, content or proprietary information accessible through the
        Service without Youpendo’s prior written consent. express or imply that
        any statements you make are endorsed by Youpendo. use any robot, bot,
        spider, crawler, scraper, site search/retrieval application, proxy or
        other manual or automatic device, method or process to access, retrieve,
        index, “data mine,” or in any way reproduce or circumvent the
        navigational structure or presentation of the Service or its contents.
        use the Service in any way that could interfere with, disrupt or
        negatively affect the Service or the servers or networks connected to
        the Service. upload viruses or other malicious code or otherwise
        compromise the security of the Service. forge headers or otherwise
        manipulate identifiers in order to disguise the origin of any
        information transmitted to or through the Service. “frame” or “mirror”
        any part of the Service without Youpendo’s prior written authorization.
        use meta tags or code or other devices containing any reference to
        Youpendo or the Service (or any trademark, trade name, service mark,
        logo or slogan of Youpendo) to direct any person to any other website
        for any purpose. modify, adapt, sublicense, translate, sell, reverse
        engineer, decipher, decompile or otherwise disassemble any portion of
        the Service, or cause others to do so. use or develop any third-party
        applications that interact with the Service or other users’ Content or
        information without our written consent. use, access, or publish the
        Youpendo application programming interface without our written consent.
        probe, scan or test the vulnerability of our Service or any system or
        network. encourage or promote any activity that violates this Agreement.
        The Company may investigate and take any available legal action in
        response to illegal and/ or unauthorized uses of the Service, including
        termination of your account. Any software that we provide you may
        automatically download and install upgrades, updates, or other new
        features. You may be able to adjust these automatic downloads through
        your device’s settings.
        {'\n'}
        <Text style={styles.boldText}>7. Rights you Grant Youpendo.</Text>
        {'\n'}
        By creating an account, you grant to Youpendo a worldwide, transferable,
        sub-licensable, royalty-free, right and license to host, store, use,
        copy, display, reproduce, adapt, edit, publish, modify and distribute
        information you authorize us to access from Facebook, as well as any
        information you post, upload, display or otherwise make available
        (collectively, “post”) on the Service or transmit to other users
        (collectively, “Content”). Youpendo’s license to your Content shall be
        non-exclusive, except that Youpendo’s license shall be exclusive with
        respect to derivative works created through use of the Service. For
        example, Youpendo would have an exclusive license to screenshots of the
        Service that include your Content. In addition, so that Youpendo can
        prevent the use of your Content outside of the Service, you authorize
        Youpendo to act on your behalf with respect to infringing uses of your
        Content taken from the Service by other users or third parties. Our
        license to your Content is subject to your rights under applicable law
        (for example laws regarding personal data protection to the extent any
        Content contains personal information as defined by those laws) and is
        for the limited purpose of operating, developing, providing, and
        improving the Service and researching and developing new ones. You agree
        that any Content you place or that you authorize us to place on the
        Service may be viewed by other users and may be viewed by any person
        visiting or participating in the Service (such as individuals who may
        receive shared Content from other Youpendo users). You agree that all
        information that you submit upon creation of your account, including
        information submitted from your Facebook account, is accurate and
        truthful and you have the right to post the Content on the Service and
        grant the license to Youpendo above. You understand and agree that we
        may monitor or review any Content you post as part of a Service. We may
        delete any Content, in whole or in part, that in our sole judgment
        violates this Agreement or may harm the reputation of the Service. When
        communicating with our customer care representatives, you agree to be
        respectful and kind. If we feel that your behavior towards any of our
        customer care representatives or other employees is at any time
        threatening or offensive, we reserve the right to immediately terminate
        your account. In consideration for Youpendo allowing you to use the
        Service, you agree that we, our affiliates, and our third-party partners
        may place advertising on the Service. By submitting suggestions or
        feedback to Youpendo regarding our Service, you agree that Youpendo may
        use and share such feedback for any purpose without compensating you.
        You agree that Youpendo may access, preserve and disclose your account
        information and Content if required to do so by law or in a good faith
        belief that such access, preservation or disclosure is reasonably
        necessary, such as to: (i) comply with legal process; (ii) enforce this
        Agreement; (iii) respond to claims that any Content violates the rights
        of third parties; (iv) respond to your requests for customer service; or
        (v) protect the rights, property or personal safety of the Company or
        any other person.
        {'\n'}
        <Text style={styles.boldText}>8. Community Rules.</Text>
        {'\n'}
        By using the Service, you agree that you will not:
        {'\n'}
        use the Service for any purpose that is illegal or prohibited by this
        Agreement. use the Service for any harmful or nefarious purpose. use the
        Service in order to damage Youpendo. violate our Community Guidelines ,
        as updated from time to time. spam, solicit money from or defraud any
        users. impersonate any person or entity or post any images of another
        person without his or her permission. bully, “stalk,” intimidate,
        assault, harass, mistreat or defame any person. post any Content that
        violates or infringes anyone’s rights, including rights of publicity,
        privacy, copyright, trademark or other intellectual property or contract
        right. post any Content that is hate speech, threatening, sexually
        explicit or pornographic; incites violence; or contains nudity or
        graphic or gratuitous violence. post any Content that promotes racism,
        bigotry, hatred or physical harm of any kind against any group or
        individual. solicit passwords for any purpose, or personal identifying
        information for commercial or unlawful purposes from other users or
        disseminate another person’s personal information without his or her
        permission. use another user’s account, share an account with another
        user, or maintain more than one account. create another account if we
        have already terminated your account, unless you have our permission.
        Youpendo reserves the right to investigate and/ or terminate your
        account you have violated this Agreement, misused the Service or behaved
        in a way that Youpendo regards as inappropriate or unlawful, including
        actions or communications that occur on or off the Service.
        {'\n'}
        <Text style={styles.boldText}>9. Other Users’ Content.</Text>
        {'\n'}
        Although Youpendo reserves the right to review and remove Content that
        violates this Agreement, such Content is the sole responsibility of the
        user who posts it, and Youpendo cannot guarantee that all Content will
        comply with this Agreement. If you see Content on the Service that
        violates this Agreement, please report it within the Service or
        via artur.zvinchuk@i22.de
        {'\n'}
        <Text style={styles.boldText}>
          10. Notice and Procedure for Making Claims of Copyright Infringement.
        </Text>
        {'\n'}
        If you believe that your work has been copied and posted on the Service
        in a way that constitutes copyright infringement, please provide us with
        the following information: an electronic or physical signature of the
        person authorized to act on behalf of the owner of the copyright
        interest; a description of the copyrighted work that you claim has been
        infringed; a description of where the material that you claim is
        infringing is located on the Service (and such description must be
        reasonably sufficient to enable us to find the alleged infringing
        material); your contact information, including address, telephone number
        and email address; a written statement by you that you have a good faith
        belief that the disputed use is not authorized by the copyright owner,
        its agent, or the law; and a statement by you, made under penalty of
        perjury, that the above information in your notice is accurate and that
        you are the copyright owner or authorized to act on the copyright
        owner’s behalf. Notice of claims of copyright infringement should be
        provided to us via email to contact@youpendo.com, or via mail to the
        following address:
        {'\n'}
        Friedrich Breuer Strasse 19, 53225 Bonn
        {'\n'}
        Youpendo will terminate the accounts of repeat infringers.
        {'\n'}
        <Text style={styles.boldText}>11. Disclaimers.</Text>
        {'\n'}
        YOUPENDO PROVIDES THE SERVICE ON AN “AS IS” AND “AS AVAILABLE” BASIS AND
        TO THE EXTENT PERMITTED BY APPLICABLE LAW, GRANTS NO WARRANTIES OF ANY
        KIND, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE WITH RESPECT TO
        THE SERVICE (INCLUDING ALL CONTENT CONTAINED THEREIN), INCLUDING,
        WITHOUT LIMITATION, ANY IMPLIED WARRANTIES OF SATISFACTORY QUALITY,
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT.
        YOUPENDO DOES NOT REPRESENT OR WARRANT THAT (A) THE SERVICE WILL BE
        UNINTERRUPTED, SECURE OR ERROR FREE, (B) ANY DEFECTS OR ERRORS IN THE
        SERVICE WILL BE CORRECTED, OR (C) THAT ANY CONTENT OR INFORMATION YOU
        OBTAIN ON OR THROUGH THE SERVICE WILL BE ACCURATE.
        {'\n'}
        YOUPENDO TAKES NO RESPONSIBILITY FOR ANY CONTENT THAT YOU OR ANOTHER
        USER OR THIRD PARTY POSTS, SENDS OR RECEIVES THROUGH THE SERVICE. ANY
        MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE SERVICE
        IS ACCESSED AT YOUR OWN DISCRETION AND RISK.
        {'\n'}
        YOUPENDO DISCLAIMS AND TAKES NO RESPONSIBILITY FOR ANY CONDUCT OF YOU OR
        ANY OTHER USER, ON OR OFF THE SERVICE.
        {'\n'}
        <Text style={styles.boldText}>12. Limitation of Liability.</Text>
        {'\n'}
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
        YOUPENDO, ITS AFFILIATES, EMPLOYEES, LICENSORS OR SERVICE PROVIDERS BE
        LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL,
        PUNITIVE, OR ENHANCED DAMAGES, INCLUDING, WITHOUT LIMITATION, LOSS OF
        PROFITS, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA,
        USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM: (I) YOUR
        ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) THE
        CONDUCT OR CONTENT OF OTHER USERS OR THIRD PARTIES ON, THROUGH OR
        FOLLOWING USE OF THE SERVICE; OR (III) UNAUTHORIZED ACCESS, USE OR
        ALTERATION OF YOUR CONTENT, EVEN IF YOUPENDO HAS BEEN ADVISED AT ANY
        TIME OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING THE FOREGOING,
        IN NO EVENT SHALL YOUPENDO’S AGGREGATE LIABILITY TO YOU FOR ANY AND ALL
        CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THIS AGREEMENT
        EXCEED THE AMOUNT PAID, IF ANY, BY YOU TO YOUPENDO DURING THE
        TWENTY-FOUR (24) MONTH PERIOD IMMEDIATELY PRECEDING THE DATE THAT YOU
        FIRST FILE A LAWSUIT, ARBITRATION OR ANY OTHER LEGAL PROCEEDING AGAINST
        YOUPENDO, WHETHER IN LAW OR IN EQUITY, IN ANY TRIBUNAL. THE DAMAGES
        LIMITATION SET FORTH IN THE IMMEDIATELY PRECEDING SENTENCE APPLIES (i)
        REGARDLESS OF THE GROUND UPON WHICH LIABILITY IS BASED (WHETHER DEFAULT,
        CONTRACT, TORT, STATUTE, OR OTHERWISE), (ii) IRRESPECTIVE OF THE TYPE OF
        BREACH OF OBLIGATIONS, AND (iii) WITH RESPECT TO ALL EVENTS, THE
        SERVICE, AND THIS AGREEMENT.
        {'\n'}
        THE LIMITATION OF LIABILITY PROVISIONS SET FORTH IN THIS SECTION 14
        SHALL APPLY EVEN IF YOUR REMEDIES UNDER THIS AGREEMENT FAIL WITH RESPECT
        TO THEIR ESSENTIAL PURPOSE.
        {'\n'}
        SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN
        DAMAGES, SO SOME OR ALL OF THE EXCLUSIONS AND LIMITATIONS IN THIS
        SECTION MAY NOT APPLY TO YOU.
        {'\n'}
        <Text style={styles.boldText}>13. Governing Law.</Text>
        {'\n'}
        The laws of Bonn, Germany without regard to its conflict of laws
        rules, shall apply to any disputes arising out of or relating to this
        Agreement, the Service, or your relationship with Youpendo.
        {'\n'}
        <Text style={styles.boldText}>14. Venue.</Text>
        {'\n'}
        Except for claims that may be properly brought in a small claims court
        of competent jurisdiction in the county in which you reside or in Bonn,
        Germany, all claims arising out of or relating to this Agreement, to the
        Service, or to your relationship with Youpendo will be litigated
        exclusively in courts of Bonn, Germany. You and Youpendo consent to the
        exercise of personal jurisdiction of courts in the State of Texas and
        waive any claim that such courts constitute an inconvenient forum.
        {'\n'}
        <Text style={styles.boldText}>15. Indemnity by You.</Text>
        {'\n'}
        You agree, to the extent permitted under applicable law, to indemnify,
        defend and hold harmless Youpendo, our affiliates, and their and our
        respective officers, directors, agents, and employees from and against
        any and all complaints, demands, claims, damages, losses, costs,
        liabilities and expenses, including attorney’s fees, due to, arising out
        of, or relating in any way to your access to or use of the Service, your
        Content, or your breach of this Agreement.
        {'\n'}
        <Text style={styles.boldText}>16. Entire Agreement; Other.</Text>
        {'\n'}
        This Agreement, along with the Privacy Policy, the Community Guidelines,
        and any terms disclosed to you if you purchase or have purchased
        additional features, products or services we offer on the Service,
        contains the entire agreement between you and Youpendo regarding your
        relationship with Youpendo and the use of the Service. If any provision
        of this Agreement is held invalid, the remainder of this Agreement shall
        continue in full force and effect. The failure of Youpendo to exercise
        or enforce any right or provision of this Agreement shall not constitute
        a waiver of such right or provision. You agree that your Youpendo
        account is non-transferable and all of your rights to your account and
        its Content terminate upon your death. No agency, partnership, joint
        venture, fiduciary or other special relationship or employment is
        created as a result of this Agreement and you may not make any
        representations on behalf of or bind Youpendo in any manner.
        {'\n'}
      </Text>
    );
  };

  renderCommunityGuidelines = () => {
    return (
      <Text style={styles.modalContentText}>
        <Text style={styles.boldText}>Community Guidelines</Text>
        {'\n'}
        Welcome to the Youpendo community. If you’re honest, kind and respectful
        to others, you’ll always be welcome here. If you choose not to be, you
        may not last. Our goal is to allow users to express themselves freely as
        long as it doesn’t offend others. Everyone is held to the same standard
        on Youpendo. We’re asking you to be considerate, think before you act,
        and abide by our community guidelines both on and offline. You heard
        that right: your offline behavior can lead to termination of your
        Youpendo account. Below is a list of our community policies. If you
        violate any of these policies, you might be banned from Youpendo. We
        encourage you to report any behavior that violates our policies.
        {'\n'}
        <Text style={styles.boldText}>Nudity/Sexual Content</Text>
        {'\n'}
        Please keep it classy and appropriate for public consumption. No nudity,
        no sexually explicit content. Keep it clean.
        {'\n'}
        <Text style={styles.boldText}>Harassment</Text>
        {'\n'}
        Do not engage, or encourage others to engage, in any targeted abuse or
        harassment against any other user. This includes sending any unsolicited
        sexual content to your matches. Reports of stalking, threats, bullying,
        or intimidation, are taken very seriously.
        {'\n'}
        <Text style={styles.boldText}>Violence and Physical Harm</Text>
        {'\n'}
        We do not tolerate violent, graphic, or gory content on Youpendo, or any
        actions or content that advocate for or threaten violence of any sort,
        including threatening or promoting terrorism. Physical assault,
        coercion, and any acts of violence are strictly prohibited. Content that
        advocates for or glorifies suicide or self-harm is also not allowed. In
        these situations, we may take a number of steps to assist the user,
        including reaching out with crisis resources.
        {'\n'}
        <Text style={styles.boldText}>Hate Speech</Text>
        {'\n'}
        Any content that promotes, advocates for, or condones racism, bigotry,
        hatred, or violence against individuals or groups based on factors like
        (but not limited to) race, ethnicity, religious affiliation, disability,
        gender, age, national origin, sexual orientation, or gender identity is
        not allowed.
        {'\n'}
        <Text style={styles.boldText}>Private Information</Text>
        {'\n'}
        Don’t publicly broadcast any private information, yours or anyone
        else’s. This includes social security numbers, passports, passwords,
        financial information or unlisted contact information, such as phone
        numbers, email addresses, home/work address.
        {'\n'}
        <Text style={styles.boldText}>Spam</Text>
        {'\n'}
        Don’t be fake. Be real instead. Don’t use Youpendo to drive people to
        external websites via a link or otherwise.
        {'\n'}
        <Text style={styles.boldText}>Prostitution and Trafficking</Text>
        {'\n'}
        Promoting or advocating for commercial sexual services, human
        trafficking or other non-consensual sexual acts is strictly prohibited
        and will result in your account being banned from Youpendo.
        {'\n'}
        <Text style={styles.boldText}>Scamming</Text>
        {'\n'}
        Youpendo has a zero-tolerance policy on predatory behavior of any kind.
        Anyone attempting to get other users’ private information for fraudulent
        or illegal activity may be banned. Any user caught sharing their own
        financial account information (PayPal, Venmo, etc.) for the purpose of
        receiving money from other users may also be banned from Youpendo.
        {'\n'}
        <Text style={styles.boldText}>Impersonation</Text>
        {'\n'}
        Be yourself! Don’t pretend to be someone else. Do not impersonate, or
        otherwise misrepresent affiliation, connection or association with, any
        person or entity. This includes parody accounts.
        {'\n'}
        <Text style={styles.boldText}>Minors</Text>
        {'\n'}
        You must be 18 years of age or older to use Youpendo. As such, we do not
        allow images of unaccompanied minors. If you want to post photos of your
        children, please make sure that you are in the photo as well. If you see
        a profile that includes an unaccompanied minor, encourages harm to a
        minor, or depicts a minor in a sexual or suggestive way, please report
        it immediately.
        {'\n'}
        <Text style={styles.boldText}>
          Copyright and Trademark Infringement
        </Text>
        {'\n'}
        If it’s not yours, don’t post it. If your Youpendo profile includes any
        work that is copyrighted or trademarked by others, don’t display it,
        unless you are allowed to do so.
        {'\n'}
        <Text style={styles.boldText}>Illegal Usage</Text>
        {'\n'}
        Don’t use Youpendo to do anything illegal. If it’s illegal IRL, it’s
        illegal on Youpendo.
        {'\n'}
        <Text style={styles.boldText}>One Person, One Account</Text>
        {'\n'}
        Youpendo accounts cannot have multiple owners, so don’t create an
        account with your friend or significant other. Additionally, please
        don’t maintain multiple Youpendo accounts
        {'\n'}
        <Text style={styles.boldText}> REPORT ALL BAD BEHAVIOR</Text>
        {'\n'}
        Youpendo reserves the right to investigate and/or terminate your account
        if you have misused the Service or behaved in a way that Youpendo
        regards as inappropriate, unlawful, or in violation of the Terms of Use,
        including actions or communications that occur off the Service but
        involve users you meet through the Service.
      </Text>
    );
  };
}

const hitsloop = { top: 20, bottom: 20, left: 20, right: 20 };
const styles = StyleSheet.create({
  modalContentContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
  },
  modalContent: {
    flexDirection: 'column',
    paddingVertical: Globals.dimension.padding.small,
  },
  modalContentText: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    textAlign: 'left',
    lineHeight: 30,
  },
  boldText: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    textAlign: 'left',
    lineHeight: 30,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Globals.color.background.light,
    borderBottomColor: Globals.color.brand.neutral4,
    borderBottomWidth: 1,
    height: Globals.dimension.statusBarHeight,
  },
  headerLeft: {
    position: 'absolute',
  },
  headerCenter: {
    flex: 1,
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    textAlign: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
});
