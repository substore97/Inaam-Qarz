// Builds "أخلاق المسلم الصغير" – 50-page Arabic reading book for kids – A4 portrait.
// White words get a dark outline; tracing words are solid light grey.
const fs = require('fs');
const path = require('path');
const { art } = require('./akhlaq-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, sentence, chip1, chip2, traceword?]
const ITEMS = [["الصِّدْقُ", "Honesty", "m_honest,cup", "كَسَرَتْ سَلْمَى كُوبًا بِالخَطَأِ. سَأَلَتْ أُمُّهَا: مَنْ كَسَرَهُ؟ قَالَتْ سَلْمَى: أَنَا يَا أُمِّي، آسِفَةٌ. فَابْتَسَمَتِ الأُمُّ وَقَالَتْ: أُحِبُّ صِدْقَكِ!", "«إِنَّ الصِّدْقَ يَهْدِي إِلَى البِرِّ» (مُتَّفَقٌ عَلَيْهِ)", "أَتَعَلَّمُ: أَقُولُ الصِّدْقَ دَائِمًا."], ["بِرُّ الوَالِدَيْنِ", "Kindness to Parents", "m_parents,waterglass", "رَجَعَ أَبُو عُمَرَ مِنَ العَمَلِ مُتْعَبًا. فَأَسْرَعَ عُمَرُ وَأَحْضَرَ لَهُ كُوبَ مَاءٍ بَارِدٍ، وَقَبَّلَ يَدَهُ. فَدَعَا لَهُ أَبُوهُ: بَارَكَ اللّٰهُ فِيكَ يَا بُنَيَّ.", "«وَبِالْوَالِدَيْنِ إِحْسَانًا» (سُورَةُ الإِسْرَاءِ: ٢٣)", "أَتَعَلَّمُ: أَخْدُمُ وَالِدَيَّ بِحُبٍّ."], ["إِلْقَاءُ السَّلَامِ", "Saying Salam", "greet,school", "دَخَلَ يُوسُفُ المَدْرَسَةَ صَبَاحًا، فَقَالَ بِصَوْتٍ جَمِيلٍ: السَّلَامُ عَلَيْكُمْ! فَرَدَّ أَصْدِقَاؤُهُ: وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللّٰهِ. فَامْتَلَأَ المَكَانُ بِالمَحَبَّةِ.", "«أَفْشُوا السَّلَامَ بَيْنَكُمْ» (مُسْلِمٌ)", "أَتَعَلَّمُ: أَبْدَأُ النَّاسَ بِالسَّلَامِ."], ["الابْتِسَامَةُ", "A Smile", "m_smile,sun", "تَلْقَى مَرْيَمُ جَارَتَهَا العَجُوزَ كُلَّ صَبَاحٍ بِابْتِسَامَةٍ كَبِيرَةٍ. فَقَالَتْ لَهَا الجَارَةُ يَوْمًا: ابْتِسَامَتُكِ يَا مَرْيَمُ أَجْمَلُ مِنْ شَمْسِ الصَّبَاحِ!", "«تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ» (التِّرْمِذِيُّ)", "أَتَعَلَّمُ: الابْتِسَامَةُ صَدَقَةٌ سَهْلَةٌ."], ["المُشَارَكَةُ", "Sharing", "m_share,sandwich", "نَسِيَ صَدِيقُ خَالِدٍ طَعَامَهُ فِي البَيْتِ. فَقَسَمَ خَالِدٌ شَطِيرَتَهُ نِصْفَيْنِ، وَأَعْطَاهُ نِصْفًا. أَكَلَا مَعًا وَضَحِكَا، فَصَارَ الطَّعَامُ أَلَذَّ!", "«وَيُؤْثِرُونَ عَلَىٰ أَنْفُسِهِمْ» (سُورَةُ الحَشْرِ: ٩)", "أَتَعَلَّمُ: أُشَارِكُ أَصْدِقَائِي مَا عِنْدِي."], ["النَّظَافَةُ", "Cleanliness", "m_clean,soap,h_hands", "رَجَعَتْ لَيْلَى مِنَ الحَدِيقَةِ وَيَدَاهَا مُتَّسِخَتَانِ. غَسَلَتْهُمَا بِالمَاءِ وَالصَّابُونِ قَبْلَ الطَّعَامِ، وَقَالَتْ: الآنَ صَارَتْ يَدَايَ نَظِيفَتَيْنِ!", "«الطُّهُورُ شَطْرُ الإِيمَانِ» (مُسْلِمٌ)", "أَتَعَلَّمُ: أَغْسِلُ يَدَيَّ قَبْلَ الأَكْلِ وَبَعْدَهُ."], ["شُكْرُ اللّٰهِ", "Thanking Allah", "m_thanks,water,bread", "شَرِبَ أَحْمَدُ مَاءً بَارِدًا فِي يَوْمٍ حَارٍّ، فَقَالَ: الحَمْدُ لِلّٰهِ! سَأَلَتْهُ أُخْتُهُ: لِمَاذَا؟ قَالَ: لِأَنَّ اللّٰهَ أَعْطَانَا المَاءَ وَالطَّعَامَ وَكُلَّ شَيْءٍ.", "«لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ» (سُورَةُ إِبْرَاهِيمَ: ٧)", "أَتَعَلَّمُ: أَحْمَدُ اللّٰهَ عَلَى كُلِّ نِعْمَةٍ."], ["الصَّبْرُ", "Patience", "m_patience,seed,sprout", "زَرَعَتْ فَاطِمَةُ بِذْرَةً، وَكَانَتْ تَنْظُرُ إِلَيْهَا كُلَّ يَوْمٍ: لَمْ تَنْبُتْ! صَبَرَتْ وَسَقَتْهَا أُسْبُوعًا، ثُمَّ رَأَتْ وَرَقَةً خَضْرَاءَ صَغِيرَةً، فَقَفَزَتْ مِنَ الفَرَحِ!", "«إِنَّ اللّٰهَ مَعَ الصَّابِرِينَ» (سُورَةُ البَقَرَةِ: ١٥٣)", "أَتَعَلَّمُ: الصَّبْرُ يَأْتِي بِالخَيْرِ."], ["التَّعَاوُنُ", "Teamwork", "m_help,blocks,group", "كَانَتِ الأَلْعَابُ مُبَعْثَرَةً فِي كُلِّ مَكَانٍ. قَالَ زَيْدٌ لِإِخْوَتِهِ: هَيَّا نُرَتِّبْهَا مَعًا! وَفِي خَمْسِ دَقَائِقَ صَارَتِ الغُرْفَةُ مُرَتَّبَةً.", "«وَتَعَاوَنُوا عَلَى البِرِّ وَالتَّقْوَىٰ» (سُورَةُ المَائِدَةِ: ٢)", "أَتَعَلَّمُ: العَمَلُ مَعًا يَجْعَلُهُ سَهْلًا."], ["الرِّفْقُ بِالحَيَوَانِ", "Kindness to Animals", "m_animals,cat,bowl2", "رَأَى سَعْدٌ قِطَّةً صَغِيرَةً عَطْشَى فِي يَوْمٍ حَارٍّ. وَضَعَ لَهَا مَاءً فِي صَحْنٍ، فَشَرِبَتْ ثُمَّ قَالَتْ: مِيَاوْ! كَأَنَّهَا تَقُولُ: شُكْرًا يَا سَعْدُ.", "«فِي كُلِّ كَبِدٍ رَطْبَةٍ أَجْرٌ» (مُتَّفَقٌ عَلَيْهِ)", "أَتَعَلَّمُ: أَرْحَمُ الحَيَوَانَاتِ وَأُطْعِمُهَا."], ["الكَلِمَةُ الطَّيِّبَةُ", "Kind Words", "runner,bigheart", "حَزِنَتْ نُورُ لِأَنَّهَا خَسِرَتْ فِي السِّبَاقِ. فَقَالَتْ لَهَا صَدِيقَتُهَا هُدَى: لَقَدْ رَكَضْتِ بِقُوَّةٍ، وَسَتَفُوزِينَ المَرَّةَ القَادِمَةَ! فَعَادَتِ البَسْمَةُ إِلَى نُورَ.", "«وَالكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ» (مُتَّفَقٌ عَلَيْهِ)", "أَتَعَلَّمُ: كَلِمَتِي الطَّيِّبَةُ تُفْرِحُ غَيْرِي."], ["احْتِرَامُ الكَبِيرِ", "Respecting Elders", "m_elders,chair,grandpa", "دَخَلَ جَدُّ حَمْزَةَ الغُرْفَةَ، فَلَمْ يَجِدْ كُرْسِيًّا. فَقَامَ حَمْزَةُ فَوْرًا وَقَالَ: تَفَضَّلْ يَا جَدِّي. فَجَلَسَ الجَدُّ وَدَعَا لَهُ بِالخَيْرِ.", "«يُسَلِّمُ الصَّغِيرُ عَلَى الكَبِيرِ» (البُخَارِيُّ)", "أَتَعَلَّمُ: أَحْتَرِمُ الكِبَارَ وَأُقَدِّمُهُمْ."], ["الأَمَانَةُ", "Trustworthiness", "m_honest,coins,park", "وَجَدَتْ رُقَيَّةُ مِحْفَظَةً فِي الحَدِيقَةِ فِيهَا نُقُودٌ. لَمْ تَأْخُذْ مِنْهَا شَيْئًا، بَلْ أَعْطَتْهَا لِلْحَارِسِ لِيَرُدَّهَا إِلَى صَاحِبِهَا. فَفَرِحَ صَاحِبُهَا كَثِيرًا.", "«أَنْ تُؤَدُّوا الأَمَانَاتِ إِلَى أَهْلِهَا» (سُورَةُ النِّسَاءِ: ٥٨)", "أَتَعَلَّمُ: أَرُدُّ الأَشْيَاءَ إِلَى أَصْحَابِهَا."], ["الاعْتِذَارُ", "Saying Sorry", "m_sorry,ballfront", "رَكَلَ بِلَالٌ الكُرَةَ بِقُوَّةٍ، فَأَصَابَتْ صَدِيقَهُ. أَسْرَعَ إِلَيْهِ وَقَالَ: أَنَا آسِفٌ جِدًّا، هَلْ تَأَلَّمْتَ؟ فَابْتَسَمَ صَدِيقُهُ وَقَالَ: لَا بَأْسَ، هَيَّا نَلْعَبْ.", "«إِنَّ اللّٰهَ يُحِبُّ التَّوَّابِينَ» (سُورَةُ البَقَرَةِ: ٢٢٢)", "أَتَعَلَّمُ: إِذَا أَخْطَأْتُ أَعْتَذِرُ بِسُرْعَةٍ."], ["العَفْوُ", "Forgiving", "toytrain,bigheart", "كَسَرَ أَخُو جَنَى الصَّغِيرُ قِطَارَهَا. غَضِبَتْ قَلِيلًا، ثُمَّ تَذَكَّرَتْ أَنَّهُ صَغِيرٌ لَا يَقْصِدُ. فَعَانَقَتْهُ وَقَالَتْ: سَامَحْتُكَ، وَسَنُصْلِحُهُ مَعًا.", "«وَلْيَعْفُوا وَلْيَصْفَحُوا» (سُورَةُ النُّورِ: ٢٢)", "أَتَعَلَّمُ: أُسَامِحُ مَنْ أَخْطَأَ فِي حَقِّي."], ["آدَابُ الطَّعَامِ", "Table Manners", "plate,spoon,rice", "جَلَسَ سَلِيمٌ إِلَى المَائِدَةِ، فَقَالَ: بِسْمِ اللّٰهِ، وَأَكَلَ بِيَمِينِهِ مِمَّا أَمَامَهُ. وَلَمَّا شَبِعَ قَالَ: الحَمْدُ لِلّٰهِ.", "«يَا غُلَامُ، سَمِّ اللّٰهَ، وَكُلْ بِيَمِينِكَ» (مُتَّفَقٌ عَلَيْهِ)", "أَتَعَلَّمُ: أُسَمِّي اللّٰهَ وَآكُلُ بِيَمِينِي."], ["لَا أُسْرِفُ", "No Wasting", "m_water,tap", "رَأَتْ تَسْنِيمُ الصُّنْبُورَ مَفْتُوحًا، وَالمَاءُ يَسِيلُ بِلَا فَائِدَةٍ. فَأَغْلَقَتْهُ فَوْرًا وَقَالَتْ: كُلُّ قَطْرَةٍ نِعْمَةٌ مِنَ اللّٰهِ!", "«وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا» (سُورَةُ الأَعْرَافِ: ٣١)", "أَتَعَلَّمُ: أُحَافِظُ عَلَى المَاءِ وَالطَّعَامِ."], ["الاسْتِئْذَانُ", "Asking Permission", "myhouse,clock", "أَرَادَ رَيَّانُ أَنْ يَدْخُلَ غُرْفَةَ وَالِدَيْهِ، فَطَرَقَ البَابَ بِلُطْفٍ وَقَالَ: هَلْ أَدْخُلُ؟ قَالَتْ أُمُّهُ: تَفَضَّلْ يَا رَيَّانُ، مَا أَجْمَلَ أَدَبَكَ!", "«الِاسْتِئْذَانُ ثَلَاثٌ» (مُسْلِمٌ)", "أَتَعَلَّمُ: أَطْرُقُ البَابَ وَأَسْتَأْذِنُ."], ["الرَّحْمَةُ بِالصَّغِيرِ", "Caring for Little Ones", "baby,teddy", "بَكَى أَخُو دَانَةَ الصَّغِيرُ لِأَنَّ دُبَّهُ سَقَطَ تَحْتَ السَّرِيرِ. فَأَخْرَجَتْ دَانَةُ الدُّبَّ وَأَعْطَتْهُ إِيَّاهُ، وَغَنَّتْ لَهُ، فَضَحِكَ وَنَسِيَ بُكَاءَهُ.", "«الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمٰنُ» (التِّرْمِذِيُّ)", "أَتَعَلَّمُ: أَرْحَمُ الصِّغَارَ وَأُلَاعِبُهُمْ."], ["زِيَارَةُ المَرِيضِ", "Visiting the Sick", "f_sick,juice,flower", "مَرِضَ صَدِيقُ عَلِيٍّ وَغَابَ عَنِ المَدْرَسَةِ. فَزَارَهُ عَلِيٌّ مَعَ أَبِيهِ، وَأَحْضَرَ لَهُ عَصِيرًا، وَقَالَ لَهُ: لَا بَأْسَ، طَهُورٌ إِنْ شَاءَ اللّٰهُ.", "«عُودُوا المَرِيضَ» (البُخَارِيُّ)", "أَتَعَلَّمُ: أَزُورُ المَرِيضَ وَأَدْعُو لَهُ."], ["إِكْرَامُ الضَّيْفِ", "Welcoming Guests", "dates,juice,sofa", "جَاءَتْ خَالَةُ زَيْنَبَ لِلزِّيَارَةِ. فَاسْتَقْبَلَتْهَا زَيْنَبُ بِالسَّلَامِ، وَقَدَّمَتْ لَهَا التَّمْرَ وَالعَصِيرَ بِابْتِسَامَةٍ. فَقَالَتِ الخَالَةُ: أَنْتِ مُضِيفَةٌ رَائِعَةٌ!", "«فَلْيُكْرِمْ ضَيْفَهُ» (مُتَّفَقٌ عَلَيْهِ)", "أَتَعَلَّمُ: أُرَحِّبُ بِالضَّيْفِ وَأُكْرِمُهُ."], ["الإِحْسَانُ إِلَى الجَارِ", "Good Neighbours", "cake,myhouse", "صَنَعَتْ أُمُّ مَازِنٍ كَعْكَةً لَذِيذَةً. فَحَمَلَ مَازِنٌ قِطْعَةً مِنْهَا إِلَى جَارِهِمُ الكَبِيرِ، وَقَالَ: هٰذِهِ هَدِيَّةٌ لَكَ. فَفَرِحَ الجَارُ وَشَكَرَهُ.", "«فَلْيُكْرِمْ جَارَهُ» (مُسْلِمٌ)", "أَتَعَلَّمُ: أُحْسِنُ إِلَى جِيرَانِي."], ["التَّوَاضُعُ", "Being Humble", "medal,students", "فَازَ طَارِقٌ بِالمَرْكَزِ الأَوَّلِ فِي المُسَابَقَةِ. لَمْ يَتَكَبَّرْ عَلَى أَصْدِقَائِهِ، بَلْ قَالَ: الحَمْدُ لِلّٰهِ، وَأَنْتُمْ سَاعَدْتُمُونِي كَثِيرًا.", "«وَلَا تَمْشِ فِي الأَرْضِ مَرَحًا» (سُورَةُ لُقْمَانَ: ١٨)", "أَتَعَلَّمُ: لَا أَتَكَبَّرُ عَلَى أَحَدٍ."], ["الصَّوْتُ الهَادِئُ", "A Gentle Voice", "library,book", "فِي المَكْتَبَةِ أَرَادَتْ رِيمُ أَنْ تُخْبِرَ صَدِيقَتَهَا بِشَيْءٍ. فَتَكَلَّمَتْ بِصَوْتٍ هَادِئٍ، حَتَّى لَا تُزْعِجَ مَنْ يَقْرَؤُونَ.", "«وَاغْضُضْ مِنْ صَوْتِكَ» (سُورَةُ لُقْمَانَ: ١٩)", "أَتَعَلَّمُ: أَتَكَلَّمُ بِهُدُوءٍ وَأَدَبٍ."], ["لَا تَغْضَبْ", "Staying Calm", "cat,blocks", "أَسْقَطَ القِطُّ بُرْجَ المُكَعَّبَاتِ الَّذِي بَنَاهُ إِلْيَاسُ! كَادَ يَغْضَبُ، لٰكِنَّهُ أَخَذَ نَفَسًا عَمِيقًا، وَقَالَ: لَا بَأْسَ، سَأَبْنِي بُرْجًا أَعْلَى!", "«لَا تَغْضَبْ» (البُخَارِيُّ)", "أَتَعَلَّمُ: أَهْدَأُ وَلَا أَغْضَبُ."], ["الصَّدَقَةُ", "Giving Charity", "charitybox,coins", "جَمَعَتْ عَائِشَةُ نُقُودَهَا فِي حَصَّالَتِهَا شَهْرًا كَامِلًا. ثُمَّ وَضَعَتْ نِصْفَهَا فِي صُنْدُوقِ الصَّدَقَةِ فِي المَسْجِدِ، وَقَالَتْ: هٰذِهِ لِلْفُقَرَاءِ!", "«مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ» (مُسْلِمٌ)", "أَتَعَلَّمُ: أَتَصَدَّقُ وَلَوْ بِالقَلِيلِ."], ["السِّوَاكُ", "The Miswak", "h_miswak,miswak,tooth", "قَبْلَ الصَّلَاةِ أَخْرَجَ نَبِيلٌ سِوَاكَهُ، وَنَظَّفَ أَسْنَانَهُ. وَقَالَ لِأَخِيهِ: كَانَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ يُحِبُّ السِّوَاكَ.", "«السِّوَاكُ مَطْهَرَةٌ لِلْفَمِ مَرْضَاةٌ لِلرَّبِّ» (النَّسَائِيُّ)", "أَتَعَلَّمُ: أُنَظِّفُ أَسْنَانِي كُلَّ يَوْمٍ."], ["أَنْتَظِرُ دَوْرِي", "Waiting My Turn", "queue,bus", "وَقَفَ الأَطْفَالُ فِي صَفٍّ لِيَرْكَبُوا الحَافِلَةَ. لَمْ تَدْفَعْ لَمَى أَحَدًا، بَلِ انْتَظَرَتْ دَوْرَهَا بِهُدُوءٍ، فَرَكِبَ الجَمِيعُ بِسَلَامٍ.", "«إِنَّ اللّٰهَ يَأْمُرُ بِالعَدْلِ» (سُورَةُ النَّحْلِ: ٩٠)", "أَتَعَلَّمُ: أَنْتَظِرُ دَوْرِي وَلَا أُزَاحِمُ."], ["إِمَاطَةُ الأَذَى", "Clearing the Path", "rock,trashbin", "رَأَى مُعَاذٌ حَجَرًا كَبِيرًا فِي وَسَطِ الطَّرِيقِ. فَأَبْعَدَهُ إِلَى جَانِبِ الطَّرِيقِ، حَتَّى لَا يَتَعَثَّرَ بِهِ أَحَدٌ، وَفَرِحَ بِأَجْرِ الصَّدَقَةِ.", "«وَتُمِيطُ الأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ» (مُسْلِمٌ)", "أَتَعَلَّمُ: أُبْعِدُ الأَذَى عَنْ طَرِيقِ النَّاسِ."], ["الوَفَاءُ بِالوَعْدِ", "Keeping Promises", "bicycle,clock", "وَعَدَ آدَمُ صَدِيقَهُ أَنْ يُعِيدَ لَهُ دَرَّاجَتَهُ قَبْلَ العَصْرِ. وَفِي المَوْعِدِ تَمَامًا طَرَقَ البَابَ وَقَالَ: هٰذِهِ دَرَّاجَتُكَ، شُكْرًا لَكَ!", "«وَأَوْفُوا بِالعَهْدِ» (سُورَةُ الإِسْرَاءِ: ٣٤)", "أَتَعَلَّمُ: إِذَا وَعَدْتُ وَفَيْتُ بِوَعْدِي."], ["الكَلَامُ الجَمِيلُ", "Good Words Only", "mouth,bigheart", "غَضِبَتْ صَدِيقَةُ أَسْمَاءَ، وَقَالَتْ كَلِمَةً قَبِيحَةً. فَلَمْ تَرُدَّ أَسْمَاءُ بِمِثْلِهَا، بَلْ قَالَتْ: نَحْنُ لَا نَقُولُ إِلَّا الكَلَامَ الجَمِيلَ. فَخَجِلَتْ صَدِيقَتُهَا وَاعْتَذَرَتْ.", "«فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ» (مُتَّفَقٌ عَلَيْهِ)", "أَتَعَلَّمُ: أَقُولُ خَيْرًا أَوْ أَسْكُتُ."], ["الإِتْقَانُ", "Doing My Best", "puzzle", "كَانَتْ سُعَادُ تُرَتِّبُ قِطَعَ اللُّغْزِ. لَمْ تَتَعَجَّلْ، بَلْ وَضَعَتْ كُلَّ قِطْعَةٍ فِي مَكَانِهَا بِعِنَايَةٍ، حَتَّى ظَهَرَتْ صُورَةٌ كَامِلَةٌ جَمِيلَةٌ.", "«إِنَّ اللّٰهَ يُحِبُّ المُحْسِنِينَ» (سُورَةُ البَقَرَةِ: ١٩٥)", "أَتَعَلَّمُ: أُتْقِنُ كُلَّ عَمَلٍ أَقُومُ بِهِ."], ["أُسَاعِدُ فِي البَيْتِ", "Helping at Home", "m_help,plate,spoon", "بَعْدَ العَشَاءِ حَمَلَ حَسَنٌ الأَطْبَاقَ إِلَى المَطْبَخِ، وَقَالَ: كَانَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ يُسَاعِدُ أَهْلَهُ. فَقَالَتْ أُمُّهُ: أَحْسَنْتَ يَا بَطَلُ!", "«كَانَ يَكُونُ فِي مِهْنَةِ أَهْلِهِ» (البُخَارِيُّ)", "أَتَعَلَّمُ: أُسَاعِدُ أَهْلِي فِي البَيْتِ بِفَرَحٍ."], ["لَا أَسْخَرُ مِنْ أَحَدٍ", "No Mocking", "group,ballfront", "رَأَى أَنَسٌ أَصْحَابَهُ يَضْحَكُونَ مِنْ وَلَدٍ جَدِيدٍ. فَلَمْ يَفْعَلْ مِثْلَهُمْ، بَلْ ذَهَبَ إِلَى الوَلَدِ وَقَالَ: مَرْحَبًا بِكَ، هَلْ تَلْعَبُ مَعَنَا؟ فَفَرِحَ الوَلَدُ كَثِيرًا.", "«لَا يَسْخَرْ قَوْمٌ مِنْ قَوْمٍ» (سُورَةُ الحُجُرَاتِ: ١١)", "أَتَعَلَّمُ: أُرَحِّبُ بِالجَدِيدِ وَلَا أَسْخَرُ مِنْهُ."], ["الإِصْلَاحُ", "Making Peace", "park,bigheart", "تَخَاصَمَ صَدِيقَانِ عَلَى الأُرْجُوحَةِ. فَجَاءَ يَحْيَى وَقَالَ: لِمَاذَا لَا تَتَنَاوَبَانِ؟ كُلُّ وَاحِدٍ عَشْرَ مَرَّاتٍ! فَضَحِكَا وَتَصَالَحَا.", "«فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ» (سُورَةُ الحُجُرَاتِ: ١٠)", "أَتَعَلَّمُ: أُصْلِحُ بَيْنَ المُتَخَاصِمِينَ."], ["أَفْرَحُ لِغَيْرِي", "Happy for Others", "gift,balloon:#ff6b8a", "حَصَلَتْ صَدِيقَةُ جُمَانَةَ عَلَى هَدِيَّةٍ جَمِيلَةٍ. فَلَمْ تَحْسُدْهَا جُمَانَةُ، بَلْ قَالَتْ: مَا شَاءَ اللّٰهُ! بَارَكَ اللّٰهُ لَكِ فِيهَا. فَفَرِحَتِ الصَّدِيقَتَانِ مَعًا.", "«لَا تَحَاسَدُوا» (مُتَّفَقٌ عَلَيْهِ)", "أَتَعَلَّمُ: أُحِبُّ الخَيْرَ لِأَصْدِقَائِي."], ["آدَابُ العُطَاسِ", "Sneezing Manners", "h_sneeze,tissue", "عَطَسَ إِبْرَاهِيمُ، فَغَطَّى فَمَهُ بِمِنْدِيلٍ وَقَالَ: الحَمْدُ لِلّٰهِ. فَقَالَ أَبُوهُ: يَرْحَمُكَ اللّٰهُ. فَرَدَّ: يَهْدِيكُمُ اللّٰهُ وَيُصْلِحُ بَالَكُمْ.", "«إِذَا عَطَسَ أَحَدُكُمْ فَلْيَقُلْ: الحَمْدُ لِلّٰهِ» (البُخَارِيُّ)", "أَتَعَلَّمُ: أَحْمَدُ اللّٰهَ إِذَا عَطَسْتُ."], ["الإِحْسَانُ إِلَى اليَتِيمِ", "Caring for Orphans", "gift,toytrain,balloon:#ff6b8a", "فِي العِيدِ اشْتَرَى عَبْدُ اللّٰهِ لُعْبَتَيْنِ: وَاحِدَةً لَهُ، وَوَاحِدَةً لِجَارِهِ اليَتِيمِ. فَلَعِبَا مَعًا، وَكَانَ العِيدُ أَجْمَلَ!", "«فَأَمَّا اليَتِيمَ فَلَا تَقْهَرْ» (سُورَةُ الضُّحَى: ٩)", "أَتَعَلَّمُ: أُفْرِحُ اليَتِيمَ وَأُحْسِنُ إِلَيْهِ."], ["شُكْرُ النَّاسِ", "Thanking People", "m_thanks,trashbin", "مَرَّتْ سُمَيَّةُ بِعَامِلِ النَّظَافَةِ وَهُوَ يُنَظِّفُ الشَّارِعَ. فَابْتَسَمَتْ وَقَالَتْ: شُكْرًا لَكَ يَا عَمُّ، شَارِعُنَا جَمِيلٌ بِسَبَبِكَ! فَابْتَسَمَ العَامِلُ سَعِيدًا.", "«لَا يَشْكُرُ اللّٰهَ مَنْ لَا يَشْكُرُ النَّاسَ» (أَبُو دَاوُدَ)", "أَتَعَلَّمُ: أَشْكُرُ كُلَّ مَنْ يُسَاعِدُنِي."], ["حُسْنُ الخُلُقِ", "Good Character", "bigheart,medal,rose", "سَأَلَتِ المُعَلِّمَةُ: مَنْ هُوَ الصَّدِيقُ الَّذِي نُحِبُّهُ؟ فَقَالَ الجَمِيعُ: الصَّادِقُ الرَّحِيمُ المُؤَدَّبُ! وَأَنْتَ أَيْضًا تَسْتَطِيعُ أَنْ تَكُونَ كَذٰلِكَ.", "«إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلَاقًا» (البُخَارِيُّ)", "أَتَعَلَّمُ: أَتَحَلَّى بِالأَخْلَاقِ الجَمِيلَةِ."]];
const BY = Object.fromEntries(ITEMS.map(i => [i[2], i]));
const firstLetter = w => w.replace(/[ً-ْ]/g, '').replace(/^ال/, '')[0];
const hue = i => Math.round((i * 360 / 12 * 5 + 320) % 360);

const ring = (c, w = 2.5) => [[-w, 0], [w, 0], [0, -w], [0, w], [-w * .7, -w * .7], [w * .7, -w * .7], [-w * .7, w * .7], [w * .7, w * .7]].map(([x, y]) => `${x}px ${y}px 0 ${c}`).join(',');
const isWhite = c => /^#f{3}(f{3})?$/i.test(c) || c === 'white';
const t3d = (txt, top, side, depth = 8, cls = '') => {
  const sh = isWhite(top) ? [ring(side, 3)] : [];
  for (let i = 1; i <= depth; i++) sh.push(`0 ${i}px 0 ${side}`);
  sh.push(`0 ${depth + 4}px 14px rgba(10,30,70,.38)`);
  return `<span class="t3d ${cls}" style="color:${top};text-shadow:${sh.join(',')}">${txt}</span>`;
};
function bubbles(seed, h, n = 10) {
  let s = seed * 9301 + 49297, out = '';
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) {
    const size = 14 + rnd() * 46;
    out += `<i class="bub" style="width:${size}px;height:${size}px;left:${rnd() * 100}%;top:${rnd() * 100}%;--h:${(h + rnd() * 120) % 360}"></i>`;
  }
  return out;
}
const pno = n => `<div class="pno">${AR(n)}</div>`;
const title = (txt, side) => `<h2 class="ttl">${t3d(txt, '#fff', side, 7)}</h2>`;
const sea = '<i class="conf k1"></i><i class="conf k2"></i><i class="conf k3"></i><i class="conf k4"></i>';

function maze(cols, rows, seed) {
  let s = seed; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const vis = Array.from({ length: rows }, () => Array(cols).fill(false));
  const W = { h: Array.from({ length: rows + 1 }, () => Array(cols).fill(true)), v: Array.from({ length: rows }, () => Array(cols + 1).fill(true)) };
  const st = [[0, cols - 1]]; vis[0][cols - 1] = true;
  while (st.length) {
    const [r, c] = st[st.length - 1];
    const nb = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([y, x]) => y >= 0 && y < rows && x >= 0 && x < cols && !vis[y][x]);
    if (!nb.length) { st.pop(); continue; }
    const [y, x] = nb[Math.floor(rnd() * nb.length)];
    if (y !== r) W.h[Math.max(y, r)][c] = false; else W.v[r][Math.max(x, c)] = false;
    vis[y][x] = true; st.push([y, x]);
  }
  return W;
}

const pages = [];
let P = 1;

const C = {"dir": "akhlaq-book", "prefix": "Akhlaq-Al-Muslim", "title": "أخلاق المسلم الصغير", "artmod": "akhlaq-art", "header": "Builds \"أخلاق المسلم الصغير\" – 50-page Arabic reading book for kids – A4 portrait.", "cover": "--h:200;background:#fff", "h": 200, "t1": "أَخْلَاقُ", "t2": "المُسْلِمِ الصَّغِيرِ", "s1": "#2b2350", "s2": "#c0302a", "csub": "أَرْبَعُونَ قِصَّةً قَصِيرَةً وَخُلُقًا جَمِيلًا", "cen": "Good Manners of a Little Muslim", "coverTop": ["rose", "bigheart", "sun"], "coverBot": ["m_honest", "m_parents", "m_animals", "m_thanks"], "ownerArt": "bigheart", "ownerMini": ["m_smile", "m_help", "m_share"], "noteP": "أَرْبَعُونَ مَوْقِفًا قَصِيرًا مِنْ حَيَاةِ الأَطْفَالِ، فِي كُلِّ مَوْقِفٍ خُلُقٌ جَمِيلٌ، مَعَ دَلِيلِهِ مِنَ القُرْآنِ الكَرِيمِ أَوِ السُّنَّةِ الصَّحِيحَةِ.", "noteLi": ["اقْرَأْ مَعَ طِفْلِكَ مَوْقِفًا وَاحِدًا، ثُمَّ تَحَدَّثَا عَنْهُ.", "اسْأَلْهُ: مَاذَا تَفْعَلُ لَوْ كُنْتَ مَكَانَهُ؟", "امْدَحْهُ كُلَّمَا رَأَيْتَهُ يَفْعَلُ خُلُقًا جَمِيلًا."], "noteMini": ["m_clean", "m_water", "m_elders"], "ovTitle": "أَخْلَاقِي الجَمِيلَةُ", "chip1": ["", ""], "chip2": ["", ""], "acts": [{"type": "review", "title": "أَخْلَاقٌ جَمِيلَةٌ", "rows": [["m_honest", "الصِّدْقُ"], ["m_parents", "بِرُّ الوَالِدَيْنِ"], ["greet", "السَّلَامُ"], ["m_smile", "الابْتِسَامَةُ"], ["m_share", "المُشَارَكَةُ"], ["m_clean", "النَّظَافَةُ"], ["m_thanks", "الشُّكْرُ"], ["m_patience", "الصَّبْرُ"], ["m_help", "التَّعَاوُنُ"], ["m_animals", "الرِّفْقُ بِالحَيَوَانِ"], ["m_sorry", "الاعْتِذَارُ"], ["m_elders", "احْتِرَامُ الكَبِيرِ"]]}, {"type": "facts", "title": "كَلِمَاتٌ طَيِّبَةٌ نَقُولُهَا", "rows": ["👋 عِنْدَ اللِّقَاءِ: السَّلَامُ عَلَيْكُمْ", "🍽️ قَبْلَ الأَكْلِ: بِسْمِ اللّٰهِ", "🤧 بَعْدَ العُطَاسِ: الحَمْدُ لِلّٰهِ", "🎁 لِمَنْ أَحْسَنَ إِلَيَّ: جَزَاكَ اللّٰهُ خَيْرًا", "😔 إِذَا أَخْطَأْتُ: أَنَا آسِفٌ", "🤩 إِذَا رَأَيْتُ شَيْئًا جَمِيلًا: مَا شَاءَ اللّٰهُ"]}, {"type": "qa", "title": "أَسْأَلُ وَأُجِيبُ", "rows": [["مَاذَا أَقُولُ إِذَا لَقِيتُ أَحَدًا؟", "أَقُولُ: السَّلَامُ عَلَيْكُمْ."], ["بِأَيِّ يَدٍ آكُلُ؟", "آكُلُ بِيَدِي اليُمْنَى."], ["مَاذَا أَفْعَلُ إِذَا وَجَدْتُ شَيْئًا لَيْسَ لِي؟", "أُعْطِيهِ لِكَبِيرٍ لِيَرُدَّهُ إِلَى صَاحِبِهِ."], ["مَاذَا أَفْعَلُ إِذَا أَخْطَأْتُ؟", "أَعْتَذِرُ وَأُصْلِحُ خَطَئِي."], ["مَنْ خِيَارُ النَّاسِ؟", "مِنْ خِيَارِ النَّاسِ أَحْسَنُهُمْ أَخْلَاقًا."]]}, {"type": "raw", "title": "قُدْوَتُنَا", "html": "<div class=\"refc\" style=\"--h:45\"><p>«وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ»</p><span>📖 سُورَةُ القَلَمِ: ٤</span></div>", "arts": ["mosque", "bigheart", "rose"]}], "certP": "لِأَنَّهُ قَرَأَ كِتَابَ «أَخْلَاقُ المُسْلِمِ الصَّغِيرِ» كُلَّهُ", "certArts": ["medal", "bigheart", "rose"], "blurb": "أَرْبَعُونَ قِصَّةً قَصِيرَةً، فِي كُلِّ قِصَّةٍ خُلُقٌ جَمِيلٌ يُحِبُّهُ اللّٰهُ.", "blurbLi": ["😊 الصِّدْقُ وَالابْتِسَامَةُ", "🤝 المُشَارَكَةُ وَالتَّعَاوُنُ", "🐱 الرِّفْقُ بِالحَيَوَانِ", "📖 دَلِيلٌ مِنَ القُرْآنِ وَالسُّنَّةِ"], "en2": "Good Manners of a Little Muslim – an Arabic reading book for kids", "backArts": ["m_smile", "m_help", "m_animals", "m_share"], "f1L": "📖 الدَّلِيلُ", "f2L": "🌟 الدَّرْسُ", "layout": "k27", "theme": "k27", "extraCss": "", "noteLast": "اقْرَؤُوا الكِتَابَ مَعَهُ صَفْحَةً صَفْحَةً، ثُمَّ امْنَحُوهُ الشَّهَادَةَ!"};
const AR2 = 0;
const G = (x, cls) => { const k = x.indexOf(':'); const n = k < 0 ? x : x.slice(0, k), col = k < 0 ? '' : x.slice(k + 1); const o = {}; if (cls) o.cls = cls; if (col) o.color = col; return art(n, o); };
const L = (x) => BY[x] ? BY[x][0] : BY[x.split(':')[0]] ? BY[x.split(':')[0]][0] : '';
// 1 ---------- Cover
pages.push(`
<section class="page cover">
  ${bubbles(1, C.h, 12)}
  ${C.grade ? `<div class="gbadge">${C.grade}</div>` : ''}
  ${C.coverTop.map((x, k) => `<div class="ca cs${k}">${G(x)}</div>`).join('')}
  <h1>${t3d(C.t1, '#ffffff', C.s1, 12)}<br>${t3d(C.t2, '#ffd23f', C.s2, 12)}</h1>
  <div class="csub">${C.csub}</div>
  <div class="cen">${C.cen}</div>
  ${C.coverBot.map((x, k) => `<div class="ca cs${k + 3}">${G(x)}</div>`).join('')}
</section>`);
P++;
// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:${C.h}">
  ${bubbles(2, C.h)}
  <div class="owner">
    <div class="ownerart">${G(C.ownerArt)}</div>
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', C.s1, 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${C.ownerMini.map(x => G(x, 'mini')).join('')}</div>
  </div>
  ${pno(P++)}
</section>`);
// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:120">
  ${bubbles(3, 120)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#1f8f4f')}
    <div class="card">
      <p>${C.noteP}</p>
      <ul>${C.noteLi.map(x => `<li>${x}</li>`).join('')}<li>${C.noteLast || 'العَبُوا الأَلْعَابَ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!'}</li></ul>
    </div>
    <div class="row3">${C.noteMini.map(x => G(x, 'mini')).join('')}</div>
  </div>
  ${pno(P++)}
</section>`);
// 4 ---------- Overview / contents
if (C.units) {
  let pg = 5; const rows = C.units.map((u, k) => { const r = { n: k + 1, t: u.title, en: u.en, a: u.icon, pg }; pg += 1 + (u.items || []).length + (u.acts || []).length; return r; });
  pages.push(`
<section class="page plain" style="--h:${C.h}">
  ${bubbles(4, C.h)}
  ${title(C.tocTitle || 'الفِهْرِس', C.s1)}
  <div class="toc">${rows.map(r => `<div class="tocr" style="--h:${(r.n * 47 + C.h) % 360}"><i>${AR(r.n)}</i>${G(r.a)}<div><b>${r.t}</b><small>${r.en}</small></div><span>${AR(r.pg)}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`);
} else {
pages.push(`
<section class="page plain" style="--h:${C.h}">
  ${bubbles(4, C.h)}
  ${title(C.ovTitle, C.s1)}
  ${(() => { const OV = ITEMS.filter((i, k, a) => a.findIndex(x => x[0] === i[0]) === k); return `<div class="ovg${OV.length > 20 ? ' ov40' : OV.length > 12 ? ' ov16' : ''}">${OV.map(i => `<div class="ovc">${G(String(i[2]).split(',')[0])}<b>${i[0]}</b></div>`).join('')}</div>`; })()}
  ${pno(P++)}
</section>`);
}
// items
const itemPages6 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2, tw], li) => {
  const i = li + off, h = hue(i);
  pages.push(`
  <section class="page item6" style="--h:${h}">
    <header class="l6h"><span class="l6tag">${C.ltr ? 'Lesson ' + (li + 1) : 'الدَّرْسُ ' + AR(li + 1)}</span><h2>${name}</h2><em>${en}</em></header>
    <div class="l6main">
      <figure class="l6pic">${G(ill)}</figure>
      <div class="l6side">
        <p class="l6sent">${sentence}</p>
        <div class="l6box"><small>${U.chip1[0]} ${U.chip1[1]}</small><b>${c1}</b></div>
        <div class="l6box alt"><small>${U.chip2[0]} ${U.chip2[1]}</small><b>${c2}</b></div>
      </div>
    </div>
    <div class="l6write"><b>${C.ltr ? "✍️ I write my own sentence:" : "✍️ أَكْتُبُ جُمْلَةً مِنْ عِنْدِي:"}</b><i></i><i></i><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPagesStd = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2, tw], i) => {
  i = i + off;
  const h = hue(i); const w = tw || name; const long = w.length > (C.ltr ? 6 : 10);
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},60%,28%)`, 9, name.length > 10 ? 'big long' : 'big')}<span class="en">${en}</span></div>
    <div class="water">${G(ill, 'ill')}</div>
    <div class="sent">${sentence}</div>
    <div class="chips">
      <div class="chip"><i>${U.chip1[0]}</i><div><small>${U.chip1[1]}</small><b>${c1}</b></div></div>
      <div class="chip"><i>${U.chip2[0]}</i><div><small>${U.chip2[1]}</small><b>${c2}</b></div></div>
    </div>
    <div class="trace">
      <span class="tlabel">${C.traceLabel || '✎ أَكْتُبُ الكَلِمَة'}</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(C.ltr ? (long ? [175, 520] : [115, 350, 590]) : (long ? [520, 175] : [590, 350, 115])).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}${long ? ' sm' : ''}" text-anchor="middle">${w}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});
const itemPages7 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i);
  pages.push(`
  <section class="page item7" style="--h:${h}">
    <div class="l7top"><span class="l7hex">${C.ltr ? li + 1 : AR(li + 1)}</span><small>${U.title}</small></div>
    <div class="l7hero"><figure>${G(ill)}</figure><div class="l7name"><h2>${name}</h2><em>${en}</em></div></div>
    <div class="l7steps">
      <div><i>📖</i><div><small>${C.ltr ? 'Read' : 'أَقْرَأُ'}</small><b>${sentence}</b></div></div>
      <div><i>${U.chip1[0]}</i><div><small>${U.chip1[1]}</small><b>${c1}</b></div></div>
      <div><i>${U.chip2[0]}</i><div><small>${U.chip2[1]}</small><b>${c2}</b></div></div>
    </div>
    <div class="l7note"><b>🧠 ${C.ltr ? 'My own example:' : 'أَكْتُبُ مِثَالًا مِنْ عِنْدِي:'}</b><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPages8 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i);
  pages.push(`
  <section class="page item8" style="--h:${h}">
    <aside class="l8side"><b>${C.ltr ? li + 1 : AR(li + 1)}</b><span>${U.title}</span></aside>
    <div class="l8main">
      <h2 class="l8title">${name}</h2>
      <div class="l8row">
        <figure class="l8pol">${G(ill)}<figcaption>${en}</figcaption></figure>
        <blockquote class="l8quote${sentence.length > 95 ? ' long' : ''}">${sentence}</blockquote>
      </div>
      <div class="l8info">
        <div><small>${U.chip1[0]} ${U.chip1[1]}</small><b>${c1}</b></div>
        <div><small>${U.chip2[0]} ${U.chip2[1]}</small><b>${c2}</b></div>
      </div>
      <div class="l8board"><b>${C.ltr ? '✏️ Your turn: write your own example' : '✏️ دَوْرُكَ: اكْتُبْ مِثَالًا مِنْ عِنْدِكَ'}</b><i></i><i></i><i></i></div>
    </div>
    ${pno(P++)}
  </section>`);
});
const itemPages9 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  pages.push(`
  <section class="page item9" style="--h:${h}">
    <div class="l9hero">
      <span class="l9mark">${C.ltr ? 'Lesson' : 'دَرْسٌ'}<b>${N(li + 1)}</b></span>
      <div class="l9t"><h2${name.length > 18 ? ' class="long"' : ''}>${name}</h2><em>${en}</em></div>
      <figure class="l9pic">${G(ill)}</figure>
    </div>
    <ol class="l9pts">
      <li><b>${N(1)}</b><div><small>${C.ltr ? 'Read' : 'أَقْرَأُ'}</small><p>${sentence}</p></div></li>
      <li><b>${N(2)}</b><div><small>${U.chip1[1]}</small><p>${c1}</p></div></li>
      <li><b>${N(3)}</b><div><small>${U.chip2[1]}</small><p>${c2}</p></div></li>
    </ol>
    <div class="l9bub"><b>${C.ltr ? '💬 Now you: write a sentence of your own' : '💬 الآنَ أَنْتَ: اكْتُبْ جُمْلَةً مِنْ عِنْدِكَ'}</b><i></i><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPages10 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  pages.push(`
  <section class="page item10" style="--h:${h}">
    <div class="l10h"><b>${N(li + 1)}</b><div><h2${name.length > 20 ? ' class="long"' : ''}>${name}</h2><em>${en}</em></div></div>
    <div class="l10map">
      <div class="l10c l10top"><small>📖 ${C.ltr ? 'Read' : 'أَقْرَأُ'}</small><p>${sentence}</p></div>
      <div class="l10c l10a"><small>${U.chip1[0]} ${U.chip1[1]}</small><p>${c1}</p></div>
      <figure class="l10pic">${G(ill)}</figure>
      <div class="l10c l10b"><small>${U.chip2[0]} ${U.chip2[1]}</small><p>${c2}</p></div>
    </div>
    <div class="l10card"><b>${C.ltr ? '🗂️ My example card' : '🗂️ بِطَاقَتِي: أَكْتُبُ مِثَالًا مِنْ عِنْدِي'}</b><i></i><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPages12 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  const long = (sentence + c1 + c2).replace(/<[^>]+>/g, '').length > 150;
  pages.push(`
  <section class="page item12" style="--h:${h}">
    <aside class="p12"><small>${C.ltr ? 'LESSON' : 'الدَّرْسُ'}</small><b>${N(li + 1)}</b><figure>${G(ill)}</figure><em>${en}</em><span>${U.title}</span></aside>
    <div class="m12${long ? ' long' : ''}">
      <h2>${name}</h2>
      <div class="q12">${sentence}</div>
      <div class="tb12"><i>${U.chip1[0]}</i><div><small>${U.chip1[1]}</small><b>${c1}</b></div></div>
      <div class="tb12"><i>${U.chip2[0]}</i><div><small>${U.chip2[1]}</small><b>${c2}</b></div></div>
      <div class="lp12"><b>${C.ltr ? '✉️ My own example' : '✉️ مِثَالِي الخَاصُّ'}</b><u></u><u></u><u></u><u></u><u></u></div>
    </div>
    ${pno(P++)}
  </section>`);
});
const itemPages11 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  pages.push(`
  <section class="page item11" style="--h:${h}">
    <div class="run11"><span>${U.title}</span><b>${C.ltr ? 'My English Book' : C.t1}</b></div>
    <div class="k11">${C.ltr ? 'Lesson ' + (li + 1) : 'الدَّرْسُ ' + AR(li + 1)}</div>
    <h2 class="t11${name.length > 22 ? ' long' : ''}">${name}</h2>
    <div class="d11">${en}</div>
    <div class="b11">
      <figure class="f11">${G(ill)}<figcaption>${C.ltr ? '▲ ' : '▲ '}${name}</figcaption></figure>
      <div class="c11${(sentence + c1 + c2).replace(/<[^>]+>/g, '').length > 150 ? ' long' : ''}">
        <p class="lead11">${sentence}</p>
        <div class="fx11"><small>${U.chip1[0]} ${U.chip1[1]}</small><b>${c1}</b></div>
        <div class="fx11"><small>${U.chip2[0]} ${U.chip2[1]}</small><b>${c2}</b></div>
      </div>
    </div>
    <div class="nb11"><div class="sp11">${'<i></i>'.repeat(12)}</div><b>${C.ltr ? '✍️ Notebook: my own example' : '✍️ دَفْتَرِي: أَكْتُبُ مِثَالًا مِنْ عِنْدِي'}</b><u></u><u></u><u></u><u></u></div>
    ${pno(P++)}
  </section>`);
});
// ===== Grade-1 topic-book layouts k1..k10 (each a different page design) =====
const TRK = (w, cls = '') => { const long = w.length > 10; return `<div class="trace ${cls}"><span class="tlabel">✎ أَكْتُبُ الكَلِمَةَ</span><svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(long ? [520, 175] : [590, 350, 115]).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}${long ? ' sm' : ''}" text-anchor="middle">${w}</text>`).join('')}</svg></div>`; };
const KT = (t, h, d = 8) => t3d(t, '#fff', `hsl(${h},60%,26%)`, d, t.length > 12 ? 'big long' : 'big');
const KI = {
  k1: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <div class="k1sky"><i class="k1moon"></i><i class="k1s a"></i><i class="k1s b"></i><i class="k1s c"></i><div class="k1arch">${G(ill)}</div></div>
  <div class="k1tag"><b>${KT(name, 40)}</b><small>${en}</small></div>
  <div class="k1scroll">${s}</div>
  <div class="k1facts"><span>🌙 ${c1}</span><span>⭐ ${c2}</span></div>
  ${TRK(tw || name)}`,
  k2: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <div class="k2dome"><div>${G(ill)}</div></div>
  <div class="k2name">${KT(name, h)}<small>${en}</small></div>
  <div class="k2rug">${s}</div>
  <div class="k2cols"><div><i>📌</i>${c1}</div><div><i>✨</i>${c2}</div></div>
  ${TRK(tw || name)}`,
  k3: ([name, en, ill, s, c1, c2, tw, hon], i, h) => `
  <div class="k3book"><div class="k3r"><small>مِنْ أَنْبِيَاءِ اللّٰهِ</small><h2>${name}</h2><em>${hon || 'عَلَيْهِ السَّلَامُ'}</em><p>${s}</p></div><div class="k3l">${G(ill)}<b>${en}</b></div></div>
  <div class="k3lesson"><div><small>📜 أَعْرِفُ</small><b>${c1}</b></div><div><small>💡 أَتَعَلَّمُ</small><b>${c2}</b></div></div>
  ${TRK(tw || name)}`,
  k4: ([name, en, ill, s, prod, pill, tw, q], i, h) => `
  <div class="k4q">${q}</div>
  <div class="k4row"><div class="k4barn"><div>${G(ill)}</div><b>${name}</b></div><div class="k4arrow"></div><div class="k4gift"><div>${G(pill)}</div><b>${prod}</b></div></div>
  <div class="k4en">${en}</div>
  <div class="k4fence">${s}</div>
  ${TRK(tw || prod)}`,
  k5: ([name, en, ill, s, pl, n, tw], i, h) => `
  <div class="k5pair"><div class="k5one"><span>وَاحِدٌ</span>${G(ill)}<b>${name}</b></div><div class="k5ar" data-en="${en}"></div><div class="k5many"><span>كَثِيرٌ</span><div>${G(ill)}${G(ill)}${G(ill)}</div><b>${pl}</b></div></div>
  <div class="k5sent">${s}</div>
  ${TRK(tw || pl)}`,
  k6: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <div class="k6panel"><div class="k6bub">${s}</div>${G(ill)}</div>
  <div class="k6words">${s.replace(/[.!؟]/g, '').split(' ').map(w => `<span>${w}</span>`).join('')}</div>
  <div class="k6en">${en}</div>
  ${TRK(tw || name)}`,
  k7: ([name, en, ill, s, price, n, tw], i, h) => `
  <div class="k7shop"><div class="k7awn"></div><div class="k7item">${G(ill)}</div><div class="k7shelf"></div><div class="k7tag"><small>السِّعْرُ</small><b>${price}</b></div></div>
  <div class="k7name">${KT(name, h)}<small>${en}</small></div>
  <div class="k7coins"><small>أَعُدُّ النُّقُودَ:</small>${Array.from({ length: n }, () => G('coin')).join('')}</div>
  <div class="k7sent">${s}</div>
  ${TRK(tw || name)}`,
  k8: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <div class="k8phone"><div class="k8bar"><b>${en}</b><span>📶 🔋</span></div><div class="k8scr"><div class="k8pic">${G(ill)}</div><h2>${name}</h2><div class="k8m in">${s}</div><div class="k8m out">${c1}</div><div class="k8m in">${c2}</div></div></div>
  ${TRK(tw || name)}`,
  k9: ([name, en, ill, s, n, c2, tw], i, h) => `
  <div class="k9train"><i class="k9eng"></i>${Array.from({ length: 10 }, (_, k) => `<div class="${k + 1 === n ? 'on' : ''}">${AR(k + 1)}</div>`).join('')}</div>
  <div class="k9big"><b>${AR(n)}</b>${KT(name, h, 9)}<small>${en}</small></div>
  <div class="k9pic">${G(ill)}</div>
  <div class="k9sent">${s}</div>
  ${TRK(tw || name)}`,
  k10: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <i class="k10sun"></i>
  <div class="k10sign"><b>${KT(name, 28)}</b><small>${en}</small></div>
  <div class="k10pic">${G(ill)}</div>
  <svg class="k10dune" viewBox="0 0 794 420" preserveAspectRatio="none"><path d="M0 120 Q200 20 420 110 T794 80 V420 H0 Z" fill="#f3d39b"/><path d="M0 220 Q260 130 520 210 T794 190 V420 H0 Z" fill="#e9bf78"/></svg>
  <div class="k10card">${s}<div><span>🐪 ${c1}</span><span>🌴 ${c2}</span></div></div>
  ${TRK(tw || name)}`,
};
const KH = {
  k1: (a, j) => `<div class="k1ah"><i>🌙</i><h2>${a.title}</h2></div>`,
  k2: (a, j) => `<div class="k2ah"><i></i><h2>${a.title}</h2><i></i></div>`,
  k3: (a, j) => `<div class="k3ah"><span>نَشَاطٌ ${AR(j + 1)}</span><h2>${a.title}</h2></div>`,
  k4: (a, j) => `<div class="k4ah"><i></i><h2>${a.title}</h2></div>`,
  k5: (a, j) => `<div class="k5ah"><h2>${a.title}</h2></div>`,
  k6: (a, j) => `<div class="k6ah"><i>!</i><h2>${a.title}</h2></div>`,
  k7: (a, j) => `<div class="k7ah"><i></i><h2>${a.title}</h2></div>`,
  k8: (a, j) => `<div class="k8ah"><i>💬</i><div><small>نَشَاطٌ جَدِيدٌ · الآنَ</small><h2>${a.title}</h2></div></div>`,
  k9: (a, j) => `<div class="k9ah"><div>${Array.from({ length: 3 }, (_, k) => `<span>${AR(k + 1)}</span>`).join('')}</div><h2>${a.title}</h2></div>`,
  k10: (a, j) => `<div class="k10ah"><h2>${a.title}</h2><i></i></div>`,
};
// ===== Reading-only grade-1 layouts k11..k15 (no writing anywhere) =====
Object.assign(KI, {
  k11: ([title, en, arts, txt, part], i, h) => `
  <div class="k11scene">${arts.split(',').map(x => G(x)).join('')}<i class="k11ground"></i></div>
  <div class="k11page"><div class="k11t"><b>${title}</b><span>${part}</span></div><small>${en}</small><p>${txt}</p></div>`,
  k12: ([qw, en, art, q, a, note], i, h) => `
  <div class="k12q"><i>؟</i><b>${qw}</b><small>${en}</small><p>${q}</p></div>
  <div class="k12fold"><span>الجَوَابُ ⬇</span></div>
  <div class="k12a"><div>${G(art)}</div><p>${a}</p></div>
  <div class="k12note">💡 ${note}</div>`,
  k13: ([name, en, art, s, f1, f2, f3], i, h) => `
  <div class="k13board"><i class="k13clip"></i><div class="k13paper"><div class="k13tag">${en}</div><div class="k13pic">${G(art)}</div><h2>${name}</h2><p>${s}</p><ul><li>${f1}</li><li>${f2}</li><li>${f3}</li></ul></div></div>`,
  k14: ([name, honor, art, s, f1, f2, en], i, h) => `
  <div class="k14scroll"><i class="k14rod"></i><div class="k14paper"><div class="k14med">${G(art)}</div><h2>${name}</h2><em>${honor}</em><small>${en}</small><p>${s}</p><div class="k14facts"><span>${f1}</span><span>${f2}</span></div></div><i class="k14rod"></i></div>`,
  k15: ([name, en, art, s, f1, f2], i, h) => `
  <div class="k15card"><div class="k15pic">${G(art)}</div><div class="k15txt"><i class="k15stamp">✈</i><h2>${name}</h2><small>${en}</small><i class="k15mark">رِحْلَتِي</i></div></div>
  <div class="k15ticket"><b>🎫</b><p>${s}</p></div>
  <div class="k15tags"><span>🧳 ${f1}</span><span>🧳 ${f2}</span></div>`,
});
Object.assign(KH, {
  k11: (a, j) => `<div class="k11ah"><i></i><h2>${a.title}</h2><i></i></div>`,
  k12: (a, j) => `<div class="k12ah"><b>؟</b><h2>${a.title}</h2></div>`,
  k13: (a, j) => `<div class="k13ah"><i></i><h2>${a.title}</h2></div>`,
  k14: (a, j) => `<div class="k14ah"><h2>${a.title}</h2></div>`,
  k15: (a, j) => `<div class="k15ah"><i></i><h2>${a.title}</h2></div>`,
});


Object.assign(KI, {
  k16: ([L, name, a1, w1, a2, w2, nc], i) => { const h = Math.round(i * 360 / 28); const fm = nc ? [L, 'ـ' + L] : [L + 'ـ', 'ـ' + L + 'ـ', 'ـ' + L]; const hk = L === 'ا' ? ['أَ', 'إِ', 'أُ'] : [L + 'َ', L + 'ِ', L + 'ُ'];
    return `<div class="k16w" style="--h:${h}"><div class="k16top"><span class="k16n">${AR(i + 1)}</span><div class="k16block"><b>${L}</b></div><div class="k16name">${name}</div></div>
  <div class="k16rows"><div class="k16row"><small>الحَرَكَاتُ</small>${hk.map(x => `<i>${x}</i>`).join('')}</div><div class="k16row"><small>أَشْكَالُهُ</small>${fm.map(x => `<i>${x}</i>`).join('')}</div></div>
  <div class="k16words"><div>${G(a1)}<b>${w1}</b></div><div>${G(a2)}<b>${w2}</b></div></div></div>`; },
});
Object.assign(KH, { k16: (a, j) => `<div class="k16ah"><i></i><i></i><i></i><h2>${a.title}</h2></div>` });
Object.assign(KI, {
  k17: ([d, word, art, n, en], i) => { const h = Math.round(i * 360 / 20 + 10) % 360;
    const dots = k => `<div class="k17frame">${Array.from({ length: 10 }, (_, j) => `<i class="${j < k ? 'on' : ''}"></i>`).join('')}</div>`;
    const count = n <= 10 ? `<div class="k17pics n${n}">${Array.from({ length: n }, () => G(art)).join('')}</div>` : `<div class="k17frames">${dots(10)}${dots(n - 10)}</div>`;
    return `<div class="k17w" style="--h:${h}"><div class="k17ring"><div class="k17ball"><b>${d}</b><span>${en}</span></div></div>
  <div class="k17word">${word}</div>${count}</div>`; },
});
Object.assign(KH, { k17: (a, j) => `<div class="k17ah"><span>١</span><span>٢</span><span>٣</span><h2>${a.title}</h2></div>` });
// ===== 50-page reading books: layouts k18..k37 (item = [title, en, arts, text, f1, f2]) =====
const AS = a => String(a).split(',').map(x => G(x.trim())).join('');
const F1 = f => `<b>${C.f1L}</b> ${f}`, F2 = f => `<b>${C.f2L}</b> ${f}`;
const NA = a => String(a).split(',').length;
Object.assign(KI, {
  k18: ([t, en, a, x, f1, f2], i) => `<div class="k18card"><div class="k18top"><span>${AR(i + 1)}</span><h2>${t}</h2><em>${en}</em></div><div class="k18pic n${NA(a)}">${AS(a)}</div><p class="k18x">${x}</p><div class="k18stats"><div>${F1(f1)}</div><div>${F2(f2)}</div></div></div>`,
  k19: ([t, en, a, x, f1, f2], i) => `<div class="k19port"><div class="k19glass n${NA(a)}">${AS(a)}</div>${[0,1,2,3,4,5,6,7].map(k => `<i class="r${k}"></i>`).join('')}</div><h2 class="k19t">${t}</h2><em class="k19en">${en}</em><p class="k19x">${x}</p><div class="k19f"><span>${F1(f1)}</span><span>${F2(f2)}</span></div><svg class="k19wave" viewBox="0 0 794 160" preserveAspectRatio="none"><path d="M0 60 Q100 20 200 60 T400 60 T600 60 T794 60 V160 H0Z" fill="#1e88c8"/><path d="M0 100 Q100 60 200 100 T400 100 T600 100 T794 100 V160 H0Z" fill="#136aa3"/></svg>`,
  k20: ([t, en, a, x, f1, f2], i) => `<div class="k20sky"><i class="k20o o1"></i><i class="k20o o2"></i><div class="k20pl n${NA(a)}">${AS(a)}</div></div><div class="k20log"><div class="k20hd"><span>🚀 ${AR(i + 1)}</span><h2>${t}</h2></div><em>${en}</em><p>${x}</p><div class="k20f"><span>${F1(f1)}</span><span>${F2(f2)}</span></div></div>`,
  k21: ([t, en, a, x, f1, f2], i) => `<div class="k21badge"><div class="k21in n${NA(a)}">${AS(a)}</div><svg class="k21mt" viewBox="0 0 400 120"><path d="M0 120 L90 40 L150 90 L230 10 L320 80 L400 30 V120 Z" fill="hsl(var(--h),45%,40%)"/></svg></div><div class="k21rib"><h2>${t}</h2></div><em class="k21en">${en}</em><p class="k21x">${x}</p><div class="k21f"><div>${F1(f1)}</div><div>${F2(f2)}</div></div>`,
  k22: ([t, en, a, x, f1, f2], i) => `<div class="k22canopy"><i></i><i></i><i></i><i></i><i></i></div><div class="k22frame"><div class="k22pic n${NA(a)}">${AS(a)}</div></div><div class="k22sign"><h2>${t}</h2><small>${f1}</small></div><p class="k22x">${x}</p><div class="k22leaf">🍃 ${F2(f2)}</div>`,
  k23: ([t, en, a, x, f1, f2], i) => `<i class="k23moon"></i><i class="k23s s1"></i><i class="k23s s2"></i><i class="k23s s3"></i><i class="k23s s4"></i><div class="k23pic n${NA(a)}">${AS(a)}</div><div class="k23cloud"><h2>${t}</h2><p>${x}</p></div><div class="k23f"><span>🌙 ${f1}</span><span>⭐ ${f2}</span></div>`,
  k24: ([t, en, a, x, f1, f2], i) => `<div class="k24bar"><i></i><i></i><i></i><b>ROBO · ${i + 1}</b></div><div class="k24scr n${NA(a)}">${AS(a)}</div><div class="k24panel"><h2>${t}</h2><p>${x}</p></div><div class="k24chips"><span>⚙️ ${f1}</span><span>💡 ${f2}</span></div>`,
  k25: ([t, en, a, x, f1, f2], i) => `<div class="k25quilt">${Array.from({ length: 12 }, (_, k) => `<i style="--k:${k}"></i>`).join('')}</div><div class="k25patch"><div class="k25pic n${NA(a)}">${AS(a)}</div><h2>${t}</h2><p>${x}</p><div class="k25f"><span>🌻 ${f1}</span><span>🐓 ${f2}</span></div></div>`,
  k26: ([t, en, a, x, f1, f2], i) => `<div class="k26ms"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i><div class="k26arch n${NA(a)}">${AS(a)}</div><h2>${t}</h2><div class="k26orn">❖ ❖ ❖</div><p>${x}</p><div class="k26f"><div>📜 ${f1}</div><div>💡 ${f2}</div></div></div>`,
  k27: ([t, en, a, x, f1, f2], i) => `<div class="k27heart"><div class="n${NA(a)}">${AS(a)}</div></div><h2 class="k27t">${t}</h2><p class="k27x">${x}</p><div class="k27ev">📖 ${f1}</div><div class="k27med"><b>⭐</b>${f2}</div>`,
  k28: ([t, en, a, x, f1, f2], i) => `<div class="k28star"><div><h2>${t}</h2></div></div><div class="k28pic n${NA(a)}">${AS(a)}</div><p class="k28x">${x}</p><div class="k28f"><div>📖 ${f1}</div><div>🤲 ${f2}</div></div>`,
  k29: ([t, en, a, x, f1, f2], i) => `<div class="k29book"><i class="k29tape t1"></i><i class="k29tape t2"></i><div class="k29date"><b>${AR(i + 1)}</b><small>يَوْمٌ</small></div><h2>${t}</h2><div class="k29pic n${NA(a)}">${AS(a)}</div><p>${x}</p><div class="k29f"><span>💗 ${f1}</span><span>✨ ${f2}</span></div><i class="k29rib"></i></div>`,
  k30: ([t, en, a, x, f1, f2], i) => `<div class="k30env"><div class="k30q"><span>؟</span><h2>${t}</h2><p>${x}</p></div><div class="k30flap"></div><div class="k30ans"><div class="k30pic n${NA(a)}">${AS(a)}</div><b>${f1}</b></div></div><div class="k30fact">🎉 ${f2}</div>`,
  k31: ([t, en, a, x, f1, f2], i) => `<div class="k31bulb"><div class="k31glass"><div class="n${NA(a)}">${AS(a)}</div></div><i class="k31base"></i></div><h2 class="k31t">${t}</h2><p class="k31x">${x}</p><div class="k31st"><span class="s1">😮 ${f1}</span><span class="s2">🌟 ${f2}</span></div>`,
  k32: ([t, en, a, x, f1, f2], i) => `<div class="k32head"><span>🧪 ${AR(i + 1)}</span><h2>${t}</h2></div><div class="k32flask"><div class="k32liq n${NA(a)}">${AS(a)}</div></div><div class="k32steps"><div><i>١</i><p>${x}</p></div><div><i>٢</i><p><b>${C.f1L}</b> ${f1}</p></div><div><i>٣</i><p><b>${C.f2L}</b> ${f2}</p></div></div>`,
  k33: ([t, en, a, x, f1, f2], i) => `<div class="k33tabs">${['أ','ب','ت','ج','د','ر','س','ع','ف','ق','ك','م','ن','و'].map(l => `<i class="${t.replace(/[ً-ْال]/g, '').startsWith(l) ? 'on' : ''}">${l}</i>`).join('')}</div><div class="k33page"><h2>${t}</h2><em>${en}</em><div class="k33pic n${NA(a)}">${AS(a)}</div><p>${x}</p><div class="k33f"><div>${F1(f1)}</div><div>${F2(f2)}</div></div></div>`,
  k34: ([t, en, a, x, f1, f2], i) => `<div class="k34crate"><div class="k34label">${t}<small>${en}</small></div><div class="k34pic n${NA(a)}">${AS(a)}</div><i class="k34slat"></i></div><p class="k34x">${x}</p><div class="k34tags"><span>🌱 ${f1}</span><span>💪 ${f2}</span></div>`,
  k35: ([t, en, a, x, f1, f2], i) => `<div class="k35sign"><h2>${t}</h2><em>${en}</em></div><i class="k35post"></i><div class="k35pic n${NA(a)}">${AS(a)}</div><div class="k35road"><i></i></div><p class="k35x">${x}</p><div class="k35f"><span>🛣️ ${f1}</span><span>⚡ ${f2}</span></div>`,
  k36: ([t, en, a, x, f1, f2], i) => `<div class="k36app"><div class="k36hd"><b>${t}</b><span>${en}</span></div><div class="k36big n${NA(a)}">${AS(a)}</div><div class="k36row"><div><small>${C.f1L}</small>${f1}</div><div><small>${C.f2L}</small>${f2}</div></div><p>${x}</p></div>`,
  k37: ([t, en, a, x, f1, f2], i) => `<div class="k37lan"></div><div class="k37badge"><i class="k37hole"></i><div class="k37hd">${en}</div><div class="k37pic n${NA(a)}">${AS(a)}</div><h2>${t}</h2><p>${x}</p><div class="k37f"><div>🧰 ${f1}</div><div>🌟 ${f2}</div></div></div>`,
});
Object.assign(KH, {
  k18: (a) => `<div class="kbh k18ah"><h2>${a.title}</h2></div>`, k19: (a) => `<div class="kbh k19ah"><i></i><h2>${a.title}</h2></div>`,
  k20: (a) => `<div class="kbh k20ah"><h2>🚀 ${a.title}</h2></div>`, k21: (a) => `<div class="kbh k21ah"><h2>${a.title}</h2></div>`,
  k22: (a) => `<div class="kbh k22ah"><h2>🌳 ${a.title}</h2></div>`, k23: (a) => `<div class="kbh k23ah"><h2>🌙 ${a.title}</h2></div>`,
  k24: (a) => `<div class="kbh k24ah"><h2>${a.title}</h2></div>`, k25: (a) => `<div class="kbh k25ah"><h2>${a.title}</h2></div>`,
  k26: (a) => `<div class="kbh k26ah"><h2>❖ ${a.title} ❖</h2></div>`, k27: (a) => `<div class="kbh k27ah"><h2>💗 ${a.title}</h2></div>`,
  k28: (a) => `<div class="kbh k28ah"><h2>${a.title}</h2></div>`, k29: (a) => `<div class="kbh k29ah"><h2>${a.title}</h2></div>`,
  k30: (a) => `<div class="kbh k30ah"><h2>✉️ ${a.title}</h2></div>`, k31: (a) => `<div class="kbh k31ah"><h2>💡 ${a.title}</h2></div>`,
  k32: (a) => `<div class="kbh k32ah"><h2>🧪 ${a.title}</h2></div>`, k33: (a) => `<div class="kbh k33ah"><h2>${a.title}</h2></div>`,
  k34: (a) => `<div class="kbh k34ah"><h2>${a.title}</h2></div>`, k35: (a) => `<div class="kbh k35ah"><h2>${a.title}</h2></div>`,
  k36: (a) => `<div class="kbh k36ah"><h2>☀️ ${a.title}</h2></div>`, k37: (a) => `<div class="kbh k37ah"><h2>${a.title}</h2></div>`,
});

const itemPagesK = (LIST) => LIST.forEach((it, i) => { const h = hue(i); pages.push(`
  <section class="page plain ki ${C.layout}i" style="--h:${h}">
  ${KI[C.layout](it, i, h)}
  ${pno(P++)}
  </section>`); });

const itemPages = (...a) => C.layout && /^k\d/.test(C.layout) ? itemPagesK(a[0]) : (C.layout === 'g6' ? itemPages6 : C.layout === 'g7' ? itemPages7 : C.layout === 'g8' ? itemPages8 : C.layout === 'g9' ? itemPages9 : C.layout === 'g10' ? itemPages10 : C.layout === 'g11' ? itemPages11 : C.layout === 'g12' ? itemPages12 : itemPagesStd)(...a);
// activities
const ACT = { match: (a) => `<div class="hint">${a.hint}</div>
  <div class="match">${a.rows.map(([l, ll, r, rl]) => `<div class="mrow"><div class="mc">${G(l)}<b>${ll || (r.startsWith("=") ? "" : L(l))}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i>${r.startsWith('=') ? `<div class="mq">${r.slice(1)}</div>` : `<div class="mc">${G(r)}<b>${rl || L(r)}</b></div>`}</div>`).join('')}</div>`,
  circle: (a) => `<div class="hint">${a.hint}</div>
  ${a.rows.map(([q, o], j) => `<div class="wgo" style="--h:${(j * 70 + 200) % 360}"><b>${q}</b><div>${o.map(x => G(x)).join('')}</div></div>`).join('')}`,
  tf: (a) => `<div class="hint">${a.hint || 'ضَعْ ✓ لِلصَّوَابِ وَ ✗ لِلْخَطَأ'}</div>
  <div class="tlrow">${a.top.map(x => G(x)).join('')}</div>
  ${a.rows.map(t => `<div class="rw"><b>${t}</b><div class="opts"><span><i></i>✓</span><span><i></i>✗</span></div></div>`).join('')}`,
  maze: (a) => { const MC = 8, MR = 9, CS = 76, MZ = maze(MC, MR, a.seed || 57); let mz = '';
    for (let r = 0; r <= MR; r++) for (let c = 0; c < MC; c++) if (MZ.h[r][c] && !(r === 0 && c === MC - 1) && !(r === MR && c === 0)) mz += `M${c * CS} ${r * CS} h${CS} `;
    for (let r = 0; r < MR; r++) for (let c = 0; c <= MC; c++) if (MZ.v[r][c]) mz += `M${c * CS} ${r * CS} v${CS} `;
    return `<div class="mazebox city">${G(a.from, 'mzs')}<svg class="mz" viewBox="-6 -6 ${MC * CS + 12} ${MR * CS + 12}"><path d="${mz}" stroke="#5a6478" stroke-width="10" stroke-linecap="round" fill="none"/></svg>${G(a.to, 'mze')}</div>`; },
  count: (a) => `<div class="hint">${a.hint || 'عُدَّ وَاكْتُبِ الرَّقَمَ فِي الدَّائِرَة 🔢'}</div>
  ${a.rows.map(([x, n]) => `<div class="crow"><div class="cimgs">${Array.from({ length: n }, () => G(x)).join('')}</div><div class="cans"></div></div>`).join('')}`,
  draw: (a) => `<div class="hint">${a.hint}</div><div class="bigboard"><div></div></div><div class="todayrow"><span>${a.label}</span></div>`,
  words: (a) => `<div class="hint">${a.hint}</div>${a.rows.map(([w, o], j) => `<div class="qrow" style="--h:${(j * 60 + 260) % 360}"><div class="qw">${w}</div>${o.map(x => `<div class="qo">${x}</div>`).join('')}</div>`).join('')}`,
  sums: (a) => `<div class="hint">${a.hint || 'أَحْسُبُ وَأَكْتُبُ الجَوَابَ فِي المُرَبَّع ✏️'}</div>${a.rows.map(([it, x, y, op]) => `<div class="sumr"><div class="sg">${Array.from({ length: x }, () => G(it)).join('')}</div><b>${op === '-' ? '−' : '+'}</b><div class="sg">${Array.from({ length: y }, () => G(it)).join('')}</div><b>=</b><i class="sbox"></i><span>${AR(x)} ${op === '-' ? '−' : '+'} ${AR(y)} = ....</span></div>`).join('')}`,
  raw: (a) => a.html.replace(/<span data-a="([^"]+)"><\/span>/g, (_, x) => G(x)) + (a.arts ? `<div class="tlrow big2">${a.arts.map(x => G(x)).join("")}</div>` : ""),
};
if (C.layout === 'g6') {
  const LET = C.ltr ? ['a', 'b', 'c', 'd'] : ['أ', 'ب', 'ج', 'د'];
  ACT.words = (a) => `<div class="hint6">${a.hint}</div><div class="q6grid">${a.rows.map(([w, o], j) => `<div class="q6" style="--h:${(j * 70 + 200) % 360}"><span class="qn">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${w}</p><div class="q6o">${o.map((x, k) => `<span><i>${LET[k]}</i>${x}</span>`).join('')}</div></div>`).join('')}</div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="hint6">${a.hint || 'ضَعْ ✓ لِلصَّوَابِ وَ ✗ لِلْخَطَأِ'}</div><table class="tf6"><tr><th></th><th>${C.ltr ? 'Sentence' : 'العِبَارَةُ'}</th><th>✓</th><th>✗</th></tr>${a.rows.map((t, j) => `<tr><td class="n">${C.ltr ? j + 1 : AR(j + 1)}</td><td>${t}</td><td><i></i></td><td><i></i></td></tr>`).join('')}</table><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g7') {
  ACT.words = (a) => `<div class="hint7">${a.hint}</div><div class="q7list">${a.rows.map(([w, o], j) => `<div class="q7"><span class="q7n">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${w}</p><div class="q7o">${o.map(x => `<span><u></u>${x}</span>`).join('')}</div></div>`).join('')}</div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="hint7">${a.hint || 'أَضَعُ دَائِرَةً حَوْلَ: ✓ صَوَابٌ، أَوْ ✗ خَطَأٌ'}</div><div class="tf7">${a.rows.map((t, j) => `<div><span class="q7n">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${t}</p><div class="tf7b"><span>✓ ${C.ltr ? 'True' : 'صَوَابٌ'}</span><span>✗ ${C.ltr ? 'False' : 'خَطَأٌ'}</span></div></div>`).join('')}</div><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g8') {
  ACT.words = (a) => `<div class="f8"><div class="hint8">${a.hint}</div><ol class="q8">${a.rows.map(([w, o], j) => `<li><span class="q8n">${C.ltr ? j + 1 : AR(j + 1)}</span><div><p>${w}</p><div class="q8o">( ${o.map(x => `<span>${x}</span>`).join('<em>|</em>')} )</div></div></li>`).join('')}</ol></div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="f8"><div class="hint8">${a.hint || 'أَضَعُ عَلَامَةَ ( ✓ ) أَمَامَ العِبَارَةِ الصَّحِيحَةِ، وَعَلَامَةَ ( ✗ ) أَمَامَ العِبَارَةِ الخَاطِئَةِ'}</div><ol class="tf8">${a.rows.map((t, j) => `<li><span class="q8n">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${t}</p><i>(&nbsp;&nbsp;&nbsp;&nbsp;)</i></li>`).join('')}</ol></div><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g9') {
  const N = n => C.ltr ? n : AR(n);
  ACT.words = (a) => `<div class="hint9">${a.hint}</div><div class="q9grid">${a.rows.map(([w, o], j) => `<div class="q9"><div class="q9h"><span>${N(j + 1)}</span><u></u></div><p>${w}</p><ol>${o.map((x, k) => `<li><b>(${N(k + 1)})</b> ${x}</li>`).join('')}</ol></div>`).join('')}</div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="hint9">${a.hint || 'أَكْتُبُ «صَحٌّ» أَوْ «خَطَأٌ» عَلَى الخَطِّ'}</div><div class="tf9">${a.rows.map((t, j) => `<div><span>${N(j + 1)}</span><p>${t}</p><i></i></div>`).join('')}</div><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g10') {
  const N = n => C.ltr ? n : AR(n); const LT = C.ltr ? ['A', 'B', 'C', 'D'] : ['أ', 'ب', 'ج', 'د'];
  const sheet = (rows, labels) => `<div class="ans10"><b>${C.ltr ? '✏️ Answer sheet: shade the circle' : '✏️ وَرَقَةُ الإِجَابَةِ: أُظَلِّلُ الدَّائِرَةَ'}</b><div class="ans10g">${rows.map((o, j) => `<div><span>${N(j + 1)}</span>${(labels || o.map((_, k) => LT[k])).map(x => `<i>${x}</i>`).join('')}</div>`).join('')}</div></div>`;
  ACT.words = (a) => `<div class="hint10">${a.hint}</div><div class="q10${JSON.stringify(a.rows).replace(/<[^>]+>/g, '').length > 300 ? ' dense' : ''}">${a.rows.map(([w, o], j) => `<div><span>${N(j + 1)}</span><div><p>${w}</p><div class="q10o">${o.map((x, k) => `<em><b>${LT[k]}</b> ${x}</em>`).join('')}</div></div></div>`).join('')}</div>${sheet(a.rows.map(r => r[1]))}`;
  ACT.tf = (a) => `<div class="hint10">${a.hint || 'أَقْرَأُ العِبَارَاتِ، ثُمَّ أُظَلِّلُ: (ص) لِلصَّوَابِ، أَوْ (خ) لِلْخَطَأِ'}</div><div class="q10">${a.rows.map((t, j) => `<div><span>${N(j + 1)}</span><div><p>${t}</p></div></div>`).join('')}</div>${sheet(a.rows, C.ltr ? ['T', 'F'] : ['ص', 'خ'])}`;
}
if (C.layout === 'g11') {
  const N = n => C.ltr ? n : AR(n);
  ACT.words = (a) => `<div class="hint11">🖍️ ${a.hint}</div><div class="q11">${a.rows.map(([w, o], j) => `<div><p><span>${N(j + 1)}</span>${w}</p><div class="tg11">${o.map(x => `<em>${x}</em>`).join('')}</div></div>`).join('')}</div>`;
  ACT.tf = (a) => `<div class="hint11">🖍️ ${a.hint || 'أُلَوِّنُ 👍 إِذَا كَانَتِ العِبَارَةُ صَحِيحَةً، وَ 👎 إِذَا كَانَتْ خَطَأً'}</div><div class="q11 tf11">${a.rows.map((t, j) => `<div><p><span>${N(j + 1)}</span>${t}</p><div class="tg11"><em>👍</em><em>👎</em></div></div>`).join('')}</div>`;
}
if (C.layout === 'g12') {
  const N = n => C.ltr ? n : AR(n);
  ACT.words = (a) => `<div class="hint12">⭕ ${a.hint}</div><div class="x12">${a.rows.map(([w, o], j) => `<div><b>${N(j + 1)}</b><div><p>${w}</p><div class="xo12">${o.map(x => `<em>${x}</em>`).join('')}</div></div></div>`).join('')}</div>`;
  ACT.tf = (a) => `<div class="hint12">⭕ ${a.hint || '' + (C.ltr ? 'I read the sentence and circle True or False.' : 'أَقْرَأُ العِبَارَةَ، ثُمَّ أَضَعُ دَائِرَةً حَوْلَ (صَحِيحَةٌ) أَوْ (خَاطِئَةٌ)') + ''}</div><div class="x12">${a.rows.map((t, j) => `<div><b>${N(j + 1)}</b><div><p>${t}</p><div class="xo12">${(C.ltr ? ['True', 'False'] : ['صَحِيحَةٌ', 'خَاطِئَةٌ']).map(x => `<em>${x}</em>`).join('')}</div></div></div>`).join('')}</div>`;
}
Object.assign(ACT, {
  tens: (a) => `<div class="tn">${a.rows.map(([d, w]) => `<div><b>${d}</b><span>${w}</span></div>`).join('')}</div>`,
  review: (a) => `<div class="rv">${a.rows.map(([x, w]) => `<div>${G(x)}<b>${w}</b></div>`).join('')}</div>`,
  facts: (a) => `<ul class="fc">${a.rows.map(t => `<li>${t}</li>`).join('')}</ul>${a.arts ? `<div class="tlrow big2">${a.arts.map(x => G(x)).join('')}</div>` : ''}`,
  qa: (a) => `<div class="qa">${a.rows.map(([q, x]) => `<div><p class="qq">${q}</p><p class="aa">${x}</p></div>`).join('')}</div>`,
  story2: (a) => `<div class="st">${a.lines.map(l => `<p>${l}</p>`).join('')}</div>${a.arts ? `<div class="tlrow big2">${a.arts.map(x => G(x)).join('')}</div>` : ''}`,
});
const actPages = (LIST, off) => LIST.forEach((a, j) => {
  j = j + off;
  const h = [150, 200, 20, 45, 265, 100, 320, 180][j % 8];
  pages.push(`
<section class="page plain kact" style="--h:${h}">
  ${bubbles(40 + j, h)}
  ${C.layout && /^k\d/.test(C.layout) ? KH[C.layout](a, j) : C.layout === 'g12' ? `<div class="a12h"><b>${C.ltr ? j + 1 : AR(j + 1)}</b><div><small>${C.ltr ? 'Task' : 'نَشَاطٌ'}</small><h2>${a.title}</h2></div></div>` : C.layout === 'g11' ? `<div class="run11"><span>${C.ltr ? 'Practice' : 'تَدْرِيبَاتٌ'}</span><b>${C.ltr ? 'My English Book' : C.t1}</b></div><div class="k11">${C.ltr ? 'Exercise ' + (j + 1) : 'تَدْرِيبٌ ' + AR(j + 1)}</div><h2 class="t11 sm">${a.title}</h2>` : C.layout === 'g10' ? `<div class="a10h"><span>${C.ltr ? 'Task ' + (j + 1) : 'مَهَمَّةٌ ' + AR(j + 1)}</span><h2>${a.title}</h2></div>` : C.layout === 'g9' ? `<div class="a9h"><i>✏️</i><div><small>${C.ltr ? 'Exercise ' + (j + 1) : 'تَمْرِينٌ ' + AR(j + 1)}</small><h2>${a.title}</h2></div></div>` : C.layout === 'g8' ? `<div class="a8h"><span>${C.ltr ? 'Activity' : 'نَشَاطٌ'}</span><h2>${a.title}</h2></div>` : C.layout === 'g7' ? `<div class="a7h"><b>${C.ltr ? 'Exercise' : 'تَمْرِينٌ'}</b><h2>${a.title}</h2></div>` : C.layout === 'g6' ? `<div class="a6h"><span>${C.ltr ? 'Practice' : 'تَدْرِيبٌ'}</span><h2>${a.title}</h2></div>` : title(a.title, `hsl(${h},60%,30%)`)}
  ${ACT[a.type](a)}
  ${pno(P++)}
</section>`);
});

const unitPage6 = (u, k) => { const h = (k * 47 + C.h) % 360; pages.push(`
<section class="page plain unit6" style="--h:${h}">
  <div class="u6band"><div class="u6num">${C.ltr ? k + 1 : AR(k + 1)}</div><div class="u6t"><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><h1>${u.title}</h1><em>${u.en}</em></div></div>
  <div class="u6art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<div class="u6intro">${u.intro}</div>` : ''}
  <div class="u6list"><b>${C.ltr ? 'In this unit:' : 'فِي هٰذِهِ الوَحْدَةِ:'}</b>${[...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)].map((t, n) => `<span><i>${C.ltr ? n + 1 : AR(n + 1)}</i>${t}</span>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage7 = (u, k) => { const h = (k * 47 + C.h) % 360; pages.push(`
<section class="page plain unit7" style="--h:${h}">
  <div class="u7num">${C.ltr ? k + 1 : AR(k + 1)}</div>
  <div class="u7card"><small>${C.ltr ? 'Unit ' + (k + 1) : 'الوَحْدَةُ ' + ['الأُولَى','الثَّانِيَةُ','الثَّالِثَةُ','الرَّابِعَةُ','الخَامِسَةُ','السَّادِسَةُ','السَّابِعَةُ','الثَّامِنَةُ'][k]}</small><h1>${u.title}</h1><em>${u.en}</em></div>
  <div class="u7shelf">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<p class="u7intro">${u.intro}</p>` : ''}
  <div class="u7chips"><b>${C.ltr ? 'In this unit' : 'فِي هٰذِهِ الوَحْدَةِ'}</b><div>${[...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)].map(t => `<span>${t}</span>`).join('')}</div></div>
  ${pno(P++)}
</section>`); };
const unitPage8 = (u, k) => { const h = (k * 47 + C.h) % 360; const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit8" style="--h:${h}">
  <div class="u8top"><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><h1>${u.title}</h1><em>${u.en}</em></div>
  <div class="u8num">${C.ltr ? k + 1 : AR(k + 1)}</div>
  <div class="u8art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<p class="u8intro">${u.intro}</p>` : ''}
  <div class="u8grid">${all.map((t, n) => `<div><i>${C.ltr ? n + 1 : AR(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage9 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit9" style="--h:${h}">
  <div class="u9ring"><div><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><b>${N(k + 1)}</b></div></div>
  <h1 class="u9t">${u.title}</h1><em class="u9en">${u.en}</em>
  <div class="u9art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<p class="u9intro">${u.intro}</p>` : ''}
  <div class="u9toc">${all.map((t, n) => `<div><b>${N(n + 1)}</b><span>${t}</span><i></i></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage10 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit10" style="--h:${h}">
  <div class="u10top"><div class="u10stamp"><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><b>${N(k + 1)}</b></div><div><h1>${u.title}</h1><em>${u.en}</em></div></div>
  ${u.intro ? `<p class="u10intro">${u.intro}</p>` : ''}
  <div class="u10road">${all.map((t, n) => `<div class="${n % 2 ? 'r' : 'l'}"><i>${N(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  <div class="u10art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage11 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit11" style="--h:${h}">
  <div class="tk11">
    <div class="stub11"><small>${C.ltr ? 'UNIT' : 'الوَحْدَةُ'}</small><b>${N(k + 1)}</b></div>
    <div class="body11"><h1>${u.title}</h1><em>${u.en}</em>${u.intro ? `<p>${u.intro}</p>` : ''}</div>
  </div>
  <div class="art11">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  <div class="ls11"><b>${C.ltr ? 'Inside this unit' : 'فِي هٰذِهِ الوَحْدَةِ'}</b>${all.map((t, n) => `<div><i>${N(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage12 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit12" style="--h:${h}">
  <div class="u12art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  <div class="u12band"><b>${N(k + 1)}</b><div><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><h1>${u.title}</h1><em>${u.en}</em></div></div>
  ${u.intro ? `<p class="u12intro">${u.intro}</p>` : ''}
  <div class="u12tiles">${all.map((t, n) => `<div><i>${N(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage = (u, k) => C.layout === 'g12' ? unitPage12(u, k) : C.layout === 'g11' ? unitPage11(u, k) : C.layout === 'g10' ? unitPage10(u, k) : C.layout === 'g9' ? unitPage9(u, k) : C.layout === 'g8' ? unitPage8(u, k) : C.layout === 'g7' ? unitPage7(u, k) : C.layout === 'g6' ? unitPage6(u, k) : pages.push(`
<section class="page plain unit" style="--h:${(k * 47 + C.h) % 360}">
  ${bubbles(60 + k, (k * 47 + C.h) % 360, 14)}
  <div class="unum">${t3d(C.ltr ? 'Unit ' + (k + 1) : 'الوَحْدَةُ ' + ['الأُولَى','الثَّانِيَةُ','الثَّالِثَةُ','الرَّابِعَةُ','الخَامِسَةُ','السَّادِسَةُ','السَّابِعَةُ','الثَّامِنَةُ','التَّاسِعَةُ','العَاشِرَةُ'][k], '#ffd23f', '#7a3a00', 7)}</div>
  <h1 class="utitle">${t3d(u.title, '#ffffff', `hsl(${(k * 47 + C.h) % 360},60%,28%)`, 10)}</h1>
  <div class="uen">${u.en}</div>
  <div class="uart">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<div class="card uintro">${u.intro}</div>` : ''}
  ${pno(P++)}
</section>`);
if (C.units) { let off = 0, aoff = 0; C.units.forEach((u, k) => { unitPage(u, k); itemPages(u.items || [], u, off); off += (u.items || []).length; actPages(u.acts || [], aoff); aoff += (u.acts || []).length; }); }
else { itemPages(ITEMS, C, 0); actPages(C.acts, 0); }
// Certificate
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْبَطَل / لِلْبَطَلَة</p>
    <div class="nameline"></div>
    <p class="cp">${C.certP}<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${C.certArts.map(x => G(x)).join('')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);
// Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, C.h, 12)}
  <h2>${t3d(C.t1 + ' ' + C.t2, '#fff', C.s1, 8)}</h2>
  <div class="card blurb">
    <p>${C.blurb}</p>
    <ul>${C.blurbLi.map(x => `<li>${x}</li>`).join('')}</ul>
    <p class="en2">${C.en2}</p>
  </div>
  ${C.backArts.map((x, k) => `<div class="ca bs${k}">${G(x)}</div>`).join('')}
</section>`);
const css = `
@font-face{font-family:Baloo;src:url('${font('BalooBhaijaan2.ttf')}');font-weight:400 800}
@font-face{font-family:Lalezar;src:url('${font('Lalezar.ttf')}')}
@font-face{font-family:Fredoka;src:url('${font('Fredoka.ttf')}');font-weight:300 700}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Baloo,sans-serif;direction:rtl;color:#2b2340;background:#fff}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;padding:40px 40px 80px;
  background:radial-gradient(circle at 30% 20%,hsl(var(--h),100%,97%),hsl(var(--h),85%,88%) 70%,hsl(var(--h),70%,80%))}
.bub{position:absolute;border-radius:50%;opacity:.55;background:radial-gradient(circle at 35% 30%,#fff,hsl(var(--h),90%,85%) 45%,hsl(var(--h),70%,70%));box-shadow:0 6px 12px hsla(var(--h),60%,40%,.18)}
.conf{position:absolute;width:14px;height:8px;border-radius:3px}
.k1{left:8%;top:14%;background:#ff4757;transform:rotate(20deg)}.k2{left:18%;top:30%;background:#ffd23f;transform:rotate(-30deg)}.k3{right:10%;top:16%;background:#4fa8ff;transform:rotate(40deg)}.k4{right:20%;top:34%;background:#36c45d;transform:rotate(-10deg)}
.desk{position:absolute;left:0;right:0;bottom:0;height:22%;background:linear-gradient(#e0a868,#c98a4e);border-top:8px solid #b5733f}
.cloth{position:absolute;left:0;right:0;bottom:0;height:24%;background:repeating-conic-gradient(#ff6b6b 0 25%,#ffffff 0 50%) 0 0/40px 40px;opacity:.85;border-top:6px solid #e8573a}
.rail{position:absolute;left:6%;right:6%;top:9%;height:10px;border-radius:5px;background:linear-gradient(#e6ebf3,#9aa3b5)}
.floor{position:absolute;left:0;right:0;bottom:0;height:22%;background:repeating-linear-gradient(90deg,#e2b37a 0 60px,#d9a66a 60px 64px);box-shadow:inset 0 6px 0 rgba(0,0,0,.08)}
.t3d{font-family:Lalezar,Baloo;display:inline-block;line-height:1.15}
.wo{text-shadow:${ring('rgba(10,30,70,.8)', 1.6)}}
.pno{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:21px;color:#fff;
  text-shadow:${ring('hsl(var(--h),60%,25%)', 1.4)};
  background:radial-gradient(circle at 35% 30%,hsl(var(--h),90%,75%),hsl(var(--h),70%,48%));box-shadow:0 4px 0 hsl(var(--h),60%,35%),0 8px 14px rgba(0,0,0,.2)}
svg{display:block}
.ttl{position:relative;text-align:center;font-size:56px;margin-top:10px}
.hint{position:relative;text-align:center;font-size:24px;font-weight:700;color:hsl(var(--h),45%,28%);margin-top:4px}
.card{position:relative;background:#fff;border-radius:34px;padding:24px 34px;box-shadow:0 8px 0 rgba(60,120,200,.22),0 16px 26px rgba(10,30,70,.15)}
.nameline{width:520px;height:86px;margin:24px auto;border-radius:44px;background:#fff;box-shadow:inset 0 4px 10px rgba(0,0,0,.08),0 6px 0 hsl(var(--h),50%,75%)}
.mini{width:170px;height:170px;filter:drop-shadow(0 8px 8px rgba(10,30,70,.2))}
/* cover */
.cover{--h:200;background:#fff;text-align:center;padding:40px}
.cover h1{position:relative;font-size:130px;line-height:1.1;margin-top:230px}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:28px;font-weight:800;color:#c2364f;background:#fff;padding:2px 28px;border-radius:30px;box-shadow:0 6px 0 #ffc2d6,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:${ring('#c2364f', 1.6)},0 3px 0 #c2364f;direction:ltr}
.ca{position:absolute;filter:drop-shadow(0 10px 12px rgba(10,30,70,.3))}.ca svg{width:100%;height:100%}
.cs0{width:200px;height:200px;left:30px;top:20px}.cs1{width:240px;height:240px;left:270px;top:0}.cs2{width:180px;height:180px;right:30px;top:40px}
.cs3{width:230px;height:230px;left:20px;bottom:30px}.cs4{width:230px;height:230px;left:280px;bottom:10px}.cs5{width:190px;height:190px;right:30px;bottom:40px}.cs6{width:110px;height:110px;right:220px;bottom:200px}
.back h2{position:relative;font-size:90px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:27px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#c2364f;font-size:19px;margin-top:8px}
.bs0{width:220px;height:220px;left:20px;bottom:20px}.bs1{width:170px;height:170px;left:250px;bottom:40px}.bs2{width:170px;height:170px;right:210px;bottom:40px}.bs3{width:200px;height:200px;right:20px;bottom:20px}
/* owner / note */
.owner{position:relative;text-align:center;padding-top:50px}
.ownerart{width:330px;height:330px;margin:0 auto;filter:drop-shadow(0 12px 12px rgba(10,30,70,.2))}
.owner h2{font-size:62px}
.author{position:relative;display:inline-block;margin-top:4px;font-size:30px;font-weight:800;color:#fff;padding:2px 28px;border-radius:26px;text-shadow:${ring('#a8245a', 1.8)};
  background:linear-gradient(150deg,#ff7eb3,#ff4f8b);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),0 5px 0 #c2366a,0 10px 16px rgba(0,0,0,.18)}
.stars,.row3{position:relative;display:flex;justify-content:center;gap:30px;margin-top:60px}
.note{position:relative;padding-top:40px}
.note .card{margin-top:30px;font-size:26px;font-weight:600;line-height:2}.note ul{margin-right:24px;margin-top:6px}
/* overview */
.ovg{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:24px}
.ovc{text-align:center;background:linear-gradient(#fff6ea,#ffd9a8);border-radius:24px;padding:6px 0 10px;box-shadow:0 5px 0 #e0a060,0 10px 14px rgba(80,40,0,.18)}
.ovc svg{width:126px;height:126px;margin:0 auto}
.ovc b{font-size:17px;font-weight:800;color:#fff;white-space:nowrap;text-shadow:${ring('#a0561a', 1.7)}}
/* item page */
.item{display:flex;flex-direction:column;gap:20px}
.iname{position:relative;text-align:center}.iname .big{font-size:88px}.iname .big.long{font-size:66px}
.iname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,32%);direction:ltr;margin-top:-6px}
.water{position:relative;height:460px;border-radius:40px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,#ffffff,hsl(var(--h),80%,92%) 70%);
  box-shadow:inset 0 0 0 6px rgba(255,255,255,.4),0 10px 0 hsl(var(--h),45%,60%),0 20px 26px rgba(10,30,70,.25)}
.ill{position:relative;width:420px;height:420px;filter:drop-shadow(0 10px 14px rgba(10,30,70,.3))}
.sent{position:relative;margin:0 auto;padding:6px 36px;border-radius:50px;background:#fff;font-size:33px;font-weight:800;color:hsl(var(--h),60%,26%);
  box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(10,30,70,.15)}
.chips{position:relative;display:flex;gap:20px;justify-content:center}
.chip{width:330px;height:104px;border-radius:28px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));display:flex;align-items:center;gap:14px;padding:0 18px;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(10,30,70,.12)}
.chip i{font-style:normal;font-size:44px}.chip small{display:block;font-size:17px;font-weight:700;color:#6f6a8a}.chip b{font-size:28px;font-weight:800;color:hsl(var(--h),65%,30%);line-height:1.3}
.chip b.fl{font-size:44px;line-height:1}
.chip i.ab{font-size:24px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);border-radius:16px;padding:6px 10px;box-shadow:0 4px 0 hsl(var(--h),60%,34%)}
.trace{position:relative;margin:0 auto;width:690px;height:132px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(10,30,70,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#8a80a3}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:56px}.trace text.sm{font-size:40px}
.trace .solid{fill:hsl(var(--h),70%,40%)}.trace .dash{fill:#dcd5e8;stroke:none}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* activities */
.wgo{position:relative;margin-top:14px;background:rgba(255,255,255,.9);border-radius:34px;padding:8px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.wgo b{display:block;text-align:center;font-size:29px;font-weight:800;color:hsl(var(--h),60%,28%)}
.wgo div{display:flex;justify-content:space-around}.wgo svg{width:124px;height:124px}
.tlrow{position:relative;display:flex;justify-content:center;gap:30px;margin-top:8px}.tlrow svg{width:150px;height:150px}
.mazebox.city{background:linear-gradient(#d9f2ff,#bfe3a8 70%,#8fd477);box-shadow:0 8px 0 #5fa84a,0 16px 24px rgba(10,30,70,.3)}
.item .water{height:560px}.item .ill{width:500px;height:500px}
.qrow{position:relative;display:flex;align-items:center;gap:14px;margin-top:34px;background:rgba(255,255,255,.85);border-radius:34px;padding:18px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.qw{min-width:220px;text-align:center;font-size:44px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:24px;padding:4px 14px;box-shadow:0 5px 0 hsl(var(--h),60%,30%);text-shadow:-2px 0 0 hsl(var(--h),60%,22%),2px 0 0 hsl(var(--h),60%,22%),0 -2px 0 hsl(var(--h),60%,22%),0 2px 0 hsl(var(--h),60%,22%)}
.qo{flex:1;text-align:center;font-size:44px;font-weight:800;background:#fff;border-radius:22px;padding:4px;box-shadow:0 4px 0 hsl(var(--h),40%,80%)}
.tlrow.big2{margin-top:40px}.tlrow.big2 svg{width:200px;height:200px}
.iname .en{margin-top:6px}
/* readability: extra room for harakat so marks never touch neighbouring lines */
.iname .t3d{line-height:1.45}.iname .en{margin-top:10px}
.sent{line-height:1.7;padding:8px 36px}
.chip b{line-height:1.6}.chip small{line-height:1.4}
.hint{line-height:1.6}.qw,.qo{line-height:1.6}.rw b{line-height:1.6}
.ovc b{font-size:19px;line-height:1.6}.mc b{line-height:1.5}.mq{line-height:1.5;font-size:36px}
.note .card{line-height:2.1}.blurb{line-height:1.9}.refc p{line-height:1.9}
.wgo b{line-height:1.6}
.t3d{font-family:Baloo,sans-serif !important;font-weight:800}
.ovg{grid-template-columns:repeat(3,1fr) !important;gap:16px !important;margin-top:22px !important}.ovc svg{width:150px !important;height:150px !important}.ovc b{font-size:23px !important}
.toc{position:relative;margin-top:26px;display:flex;flex-direction:column;gap:14px}
.tocr{display:flex;align-items:center;gap:16px;background:#fff;border-radius:28px;padding:8px 20px;box-shadow:0 6px 0 hsl(var(--h),55%,72%)}
.tocr i{font-style:normal;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),65%,48%);text-shadow:0 0 3px hsl(var(--h),60%,22%),0 0 3px hsl(var(--h),60%,22%)}
.tocr svg{width:84px;height:84px}.tocr div{flex:1}.tocr b{display:block;font-size:31px;font-weight:800;color:hsl(var(--h),60%,26%);line-height:1.6}.tocr small{font-family:Fredoka;font-size:18px;color:#6f6a8a}
.tocr span{font-size:30px;font-weight:800;color:hsl(var(--h),60%,30%)}
.unit{text-align:center}.unum{position:relative;margin-top:60px;font-size:52px}
.utitle{position:relative;font-size:84px;margin-top:20px;line-height:1.5}
.uen{position:relative;font-family:Fredoka;font-weight:600;font-size:30px;color:hsl(var(--h),50%,30%);margin-top:6px}
.uart{position:relative;display:flex;justify-content:center;gap:20px;margin-top:40px}.uart svg{width:220px;height:220px;filter:drop-shadow(0 12px 12px rgba(10,30,70,.25))}
.uintro{margin:40px 30px 0;font-size:30px;font-weight:700;line-height:2;text-align:center}
.lgrid7{position:relative;display:grid;grid-template-columns:repeat(7,1fr);gap:14px;margin-top:30px}
.lgrid7 .lt{font-style:normal;text-align:center;font-size:60px;font-weight:800;color:#fff;border-radius:22px;padding:6px 0;line-height:1.5}
.lt.q0{background:linear-gradient(#ff8a8a,#e8392b);text-shadow:0 0 3px #7a1010,0 0 3px #7a1010;box-shadow:0 6px 0 #a8201a}
.lt.q1{background:linear-gradient(#ffd84d,#ff9f1a);text-shadow:0 0 3px #7a3a00,0 0 3px #7a3a00;box-shadow:0 6px 0 #c46a00}
.lt.q2{background:linear-gradient(#7fe08a,#2aa84c);text-shadow:0 0 3px #0f5a20,0 0 3px #0f5a20;box-shadow:0 6px 0 #1f8f3f}
.lt.q3{background:linear-gradient(#8fc4ff,#2f7de8);text-shadow:0 0 3px #0f2f70,0 0 3px #0f2f70;box-shadow:0 6px 0 #1f55b8}
.ftab{position:relative;width:100%;margin-top:30px;border-collapse:separate;border-spacing:10px}
.ftab th{font-size:28px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:18px;padding:6px;text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%);line-height:1.6}
.ftab td{font-size:56px;font-weight:800;text-align:center;background:#fff;border-radius:18px;line-height:1.6;color:hsl(var(--h),60%,28%);box-shadow:0 5px 0 hsl(var(--h),50%,78%)}
.ftab td.fl{background:hsl(var(--h),80%,92%)}
.tabox{position:relative;margin-top:30px;background:#fff;border-radius:34px;padding:20px 30px;box-shadow:0 8px 0 #ffc2dc}.tabox p{text-align:center;font-size:32px;font-weight:800;line-height:1.8}.tabox p b{color:#ff2d7a;font-size:44px}.tarow{display:flex;align-items:center;justify-content:center;gap:24px;margin-top:16px}.tarow span{min-width:200px;text-align:center;font-size:42px;font-weight:800;line-height:1.6;border-radius:22px;padding:4px 18px;background:#e3f0ff;color:#1f5fbf}.tarow span:last-child{background:#ffe3f0;color:#c2366a}.tarow i{font-style:normal;font-size:34px;font-weight:800;color:#ff2d7a}
.rsent{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:16px}
.rs{display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:28px;padding:10px 26px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.rs b{font-size:40px;font-weight:800;line-height:1.8;color:hsl(var(--h),60%,26%)}.rs svg{width:100px;height:100px}
.story{margin-top:30px}.story h3{text-align:center;font-size:42px;font-weight:800;color:hsl(var(--h),60%,30%);line-height:1.6}.story p{font-size:36px;font-weight:700;line-height:2.2;text-align:right;margin-top:10px}
.sumr{position:relative;display:flex;align-items:center;gap:10px;margin-top:30px;min-height:150px;background:#fff;border-radius:28px;padding:10px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,76%);direction:rtl}
.sumr .sg{display:flex;flex-wrap:wrap;gap:2px;width:170px;justify-content:center}.sumr .sg svg{width:60px;height:60px}
.sumr b{font-size:46px;font-weight:800;color:hsl(var(--h),60%,35%)}.sumr .sbox{width:70px;height:70px;border:4px dashed hsl(var(--h),50%,60%);border-radius:16px}
.sumr span{flex:1;text-align:center;font-size:30px;font-weight:800;color:#2b2340;direction:rtl}
.ncards{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:24px}
.ncard{display:flex;align-items:center;gap:16px;background:#fff;border-radius:26px;padding:8px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.ncard b{width:86px;text-align:center;font-size:58px;font-weight:800;color:#fff;border-radius:20px;line-height:1.4;background:hsl(var(--nh),65%,50%);text-shadow:0 0 3px hsl(var(--nh),60%,20%),0 0 3px hsl(var(--nh),60%,20%)}
.ncard .dots{flex:1;display:flex;flex-wrap:wrap;gap:6px}.ncard .dots i{width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,hsl(var(--nh),80%,60%) 50%,hsl(var(--nh),70%,40%))}
.ncard small{font-size:24px;font-weight:800;color:#5a5470;line-height:1.6}
.h100{position:relative;display:grid;grid-template-columns:repeat(10,1fr);gap:6px;margin-top:24px;direction:rtl}
.h100 i{font-style:normal;text-align:center;font-size:27px;font-weight:800;background:#fff;border-radius:10px;line-height:1.9;color:#2b2340;box-shadow:0 3px 0 hsl(var(--h),40%,80%)}
.h100 i.t{background:hsl(var(--h),70%,55%);color:#fff;text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}
.tens{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:24px}
.tens div{display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:24px;padding:6px 22px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.tens b{font-size:46px;font-weight:800;color:hsl(var(--h),60%,35%);line-height:1.5}.tens span{font-size:32px;font-weight:800;line-height:1.6}
.twrite{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:30px}
.twrite div{background:#fff;border-radius:22px;text-align:center;padding:6px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.twrite b{display:block;font-size:64px;font-weight:800;color:hsl(var(--h),60%,35%);line-height:1.4}.twrite i{display:block;font-style:normal;font-size:64px;font-weight:800;color:#dcd5e8;line-height:1.4}
.clk4{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:30px}.clk4 div{background:#fff;border-radius:28px;padding:10px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}.clk4 svg{width:230px;height:230px;margin:0 auto}.clk4 b{font-size:30px;font-weight:800;line-height:1.6}
.gbadge{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:5;font-family:Fredoka,Baloo,sans-serif;font-weight:700;font-size:26px;color:#fff;padding:2px 24px;border-radius:22px;direction:ltr;
  background:linear-gradient(150deg,#ffb627,#ff6b1a);box-shadow:inset 0 3px 0 rgba(255,255,255,.4),0 4px 0 #c45000,0 8px 14px rgba(0,0,0,.18);text-shadow:0 0 3px #7a2a00,0 0 3px #7a2a00,0 0 3px #7a2a00}
.cover .cs1{top:56px !important}
bdi[dir=ltr]{unicode-bidi:isolate-override !important;direction:ltr}
/* ===== grade-1 topic books: shared base (no bubbles, plain backgrounds for small files) ===== */
.bub{display:none !important}
.t3d{font-family:Baloo !important}
.ki{padding:0 !important;text-align:center;position:relative;overflow:hidden}
.ki .trace{position:absolute;left:52px;right:52px;width:auto;bottom:96px;margin:0}
.ki .pno,.kact .pno{bottom:22px}
.cover>*:not(.ca):not(.gbadge){z-index:2}.cover .ca{z-index:3}
.kact .hint{font-size:26px;margin:10px 0 6px}
.cover .cs6{display:none !important}
/* reading-only books: hide every writing place */
.nameline,.sig,.trace{display:none !important}
.cert .cp{margin-top:30px}
.rv{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}
.rv>div{background:#fff;border-radius:24px;padding:10px 6px;text-align:center;box-shadow:0 5px 0 hsl(var(--h),45%,82%)}
.rv svg{width:120px;height:120px}.rv b{display:block;font-size:32px;font-weight:800;line-height:1.6;color:hsl(var(--h),55%,28%)}
.fc{list-style:none;margin-top:24px;padding:0}
.fc li{position:relative;background:#fff;border-radius:22px;padding:14px 22px;margin-bottom:16px;font-size:32px;font-weight:800;line-height:1.75;color:#2b2340;box-shadow:0 5px 0 hsl(var(--h),45%,82%)}
.qa{margin-top:20px}.qa>div{background:#fff;border-radius:24px;padding:12px 22px;margin-bottom:18px;box-shadow:0 5px 0 hsl(var(--h),45%,82%)}
.qa .qq{font-size:32px;font-weight:800;line-height:1.7;color:hsl(var(--h),60%,30%)}.qa .qq::before{content:'❓ '}
.qa .aa{font-size:32px;font-weight:800;line-height:1.7;color:#2b2340;border-top:2px dashed hsl(var(--h),40%,80%);margin-top:6px;padding-top:6px}.qa .aa::before{content:'✅ '}
.st{margin-top:26px;background:#fff;border-radius:26px;padding:22px 28px;box-shadow:0 6px 0 hsl(var(--h),45%,82%)}
.st p{font-size:36px;font-weight:800;line-height:2;color:#2b2340}
.kact .refc{margin-top:40px}
/* 50-page reading books: shared */
.n1,.n2,.n3{display:flex;align-items:center;justify-content:center;gap:6px}
.n1 svg{width:var(--ps,300px);height:var(--ps,300px)}.n2 svg{width:calc(var(--ps,300px)*.72);height:calc(var(--ps,300px)*.72)}.n3 svg{width:calc(var(--ps,300px)*.56);height:calc(var(--ps,300px)*.56)}
.ovg.ov40{display:grid !important;grid-template-columns:repeat(5,1fr) !important;gap:8px !important;margin-top:10px}
.ovg.ov40 .ovc{height:auto !important;width:auto !important;padding:4px 2px !important}.ovg.ov40 .ovc svg{width:66px !important;height:66px !important}.ovg.ov40 .ovc b{font-size:17px !important;line-height:1.5 !important;display:block}
.kbh{margin-bottom:16px;text-align:center}.kbh h2{font-family:Baloo;font-size:44px;font-weight:800;line-height:1.5}
.ki p{text-wrap:pretty}
.k27i{background:#ffeef3 !important}
.k27heart{position:relative;margin:60px auto 0;transform:scale(1.12);transform-origin:top center;margin-bottom:50px;width:440px;height:400px}
.k27heart::before{content:'';position:absolute;inset:0;background:#ff7aa2;clip-path:path('M220 400 C 90 300 0 230 0 120 C 0 50 55 0 120 0 C 165 0 200 25 220 60 C 240 25 275 0 320 0 C 385 0 440 50 440 120 C 440 230 350 300 220 400 Z')}
.k27heart>div{--ps:260px;position:absolute;inset:40px 50px 90px;z-index:1}
.k27t{margin-top:18px;font-family:Baloo;font-size:60px;font-weight:800;color:#c2185b;line-height:1.4}
.k27x{margin:10px 56px 0;font-size:38px;font-weight:800;line-height:1.75;color:#3a1a2a}
.k27ev{margin:14px 56px 0;background:#fff;border-radius:18px;padding:12px 16px;font-size:26px;font-weight:800;line-height:1.6;color:#3a1a2a;border:3px solid #ffb3c9}
.k27med{display:flex;align-items:center;gap:12px;margin:12px 56px 0;background:#c2185b;border-radius:40px;padding:8px 18px 8px 8px;font-size:26px;font-weight:800;line-height:1.55;color:#fff;text-shadow:0 0 3px #4a0520,0 0 3px #4a0520}
.k27med b{flex:none;width:48px;height:48px;border-radius:50%;background:#ffd23f;font-size:26px;line-height:48px;text-align:center}
.kact{background:#ffeef3 !important}.k27ah h2{color:#c2185b}
.cover{background:#ffeef3 !important}.cover::before{content:'';position:absolute;left:150px;top:220px;width:500px;height:460px;background:#ffb3c9;clip-path:path('M250 460 C 100 345 0 265 0 140 C 0 60 62 0 136 0 C 188 0 228 28 250 70 C 272 28 312 0 364 0 C 438 0 500 60 500 140 C 500 265 400 345 250 460 Z')}
.cover h1{margin-top:300px !important}

.refc{position:relative;background:#fff;border-radius:28px;padding:14px 20px;text-align:center;border:4px solid hsl(var(--h),55%,72%);box-shadow:0 6px 0 hsl(var(--h),50%,62%)}
.refc p{font-size:30px;font-weight:800;line-height:1.7;color:hsl(var(--h),65%,24%)}.refc span{font-size:20px;font-weight:800;color:#fff;background:hsl(var(--h),55%,40%);border-radius:16px;padding:2px 16px}
.mw{position:relative;display:flex;align-items:center;justify-content:space-between;margin-top:22px;border-radius:34px;padding:16px 24px;background:linear-gradient(150deg,hsl(var(--h),95%,72%),hsl(var(--h),80%,55%));box-shadow:inset 0 5px 0 rgba(255,255,255,.3),0 8px 0 hsl(var(--h),60%,36%)}
.mw b{font-size:40px;font-weight:800;color:#fff}.mw span{font-size:24px;font-weight:800;color:#fff;background:rgba(0,0,0,.18);border-radius:18px;padding:4px 14px}
.rw{position:relative;display:flex;align-items:center;justify-content:space-between;margin-top:18px;background:#fff;border-radius:28px;padding:16px 22px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.rw b{font-size:32px;font-weight:800;color:hsl(var(--h),55%,26%)}.rw .opts{gap:24px}.rw .opts span{font-size:30px}
.mtree{position:relative;margin:20px auto 0;width:680px;height:760px}.mtree svg{width:680px;height:760px}
.mtree i{position:absolute;width:56px;height:56px;border-radius:50%;background:#fff;border:4px dashed #ff4757}
.water.duo{justify-content:space-around}.water.duo .clk{width:320px;height:320px}.water.duo .obj{width:280px;height:280px;filter:drop-shadow(0 8px 10px rgba(40,20,80,.15))}
.ovc small{display:block;font-size:14px;font-weight:700;color:#6a6080}
.bigclock svg{width:560px;height:560px;margin:20px auto 0}
.hands{position:relative;display:flex;gap:20px;margin:20px 0}
.hd{flex:1;background:#fff;border-radius:28px;padding:14px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.hd i{display:block;width:120px;height:12px;border-radius:6px;margin:6px auto 10px}.hd b{display:block;font-size:30px;font-weight:800;color:hsl(var(--h),55%,26%)}.hd span{font-size:24px;font-weight:700;color:#4a4060}
.mc svg{width:130px !important;height:130px !important}
.drawc{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:30px}
.dc{background:#fff;border-radius:30px;padding:12px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}.dc svg{width:280px;height:280px;margin:0 auto}.dc b{font-size:32px;font-weight:800;color:hsl(var(--h),55%,28%)}
.op svg{width:110px;height:110px;flex:none}.op b{flex:1;margin:0 14px;font-size:32px !important}
.hcard{position:relative;margin-top:20px;background:#fff;border-radius:34px;padding:26px 30px 20px;text-align:center;border:5px solid hsl(var(--h),55%,70%);box-shadow:0 8px 0 hsl(var(--h),50%,60%)}
.hcard p{font-size:34px;font-weight:800;line-height:1.9;color:hsl(var(--h),65%,22%)}.hcard.sm p{font-size:32px}
.hsrc{display:inline-block;margin-top:8px;font-size:22px;font-weight:800;color:#fff;background:hsl(var(--h),55%,38%);border-radius:18px;padding:4px 18px}
.five{position:relative;display:flex;justify-content:space-between;gap:8px;margin-top:30px}
.fv{flex:1;text-align:center;background:#fff;border-radius:24px;padding:8px 4px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.fv svg{width:110px;height:110px;margin:0 auto}.fv b{font-size:19px;font-weight:800;color:hsl(var(--h),55%,26%)}
.fv i,.wu i,.im i,.pr i{font-style:normal;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:hsl(var(--h),55%,45%);color:#fff;font-size:22px;font-weight:800}
.item{gap:30px !important}.pcard{padding:34px 22px !important}
.pnum{position:relative;align-self:center;font-size:26px;font-weight:800;color:#fff;background:hsl(var(--h),55%,40%);border-radius:22px;padding:2px 26px}
.pcard{position:relative;background:#fff;border-radius:34px;padding:22px;text-align:center;font-size:40px;font-weight:800;line-height:1.8;color:hsl(var(--h),65%,22%);border:5px solid hsl(var(--h),55%,70%);box-shadow:0 8px 0 hsl(var(--h),50%,60%)}
.pr{position:relative;display:flex;align-items:center;gap:18px;margin-top:20px;background:#fff;border-radius:30px;padding:8px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.sky2{width:150px;height:110px;border-radius:22px;position:relative;overflow:hidden;flex:none}.sky2 svg{position:absolute;width:70px;height:70px}
.r1 svg{left:40px;top:60px}.r2 svg{left:40px;top:6px}.r3 svg{left:76px;top:24px}.r4 svg{left:76px;top:62px}.r5 svg{left:40px;top:20px}
.pr b{flex:1;font-size:36px;font-weight:800;color:hsl(var(--h),55%,26%)}.pr span{font-size:28px;font-weight:800;color:#4a4060}
.iman{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:30px}
.im{display:flex;align-items:center;gap:12px;height:110px;padding:0 18px;border-radius:30px;background:linear-gradient(150deg,hsl(var(--h),90%,94%),hsl(var(--h),70%,84%));box-shadow:0 6px 0 hsl(var(--h),45%,65%)}
.im b{font-size:28px;font-weight:800;color:hsl(var(--h),55%,24%);line-height:1.4}
.wudu{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px}
.wu{position:relative;display:flex;align-items:center;gap:8px;background:#fff;border-radius:26px;padding:8px 12px;box-shadow:0 5px 0 hsl(var(--h),50%,76%);min-height:150px}
.wu svg{width:100px;height:100px;flex:none}.wu b{font-size:22px;font-weight:800;color:hsl(var(--h),55%,26%);line-height:1.5}
.ordp{position:relative;display:flex;flex-direction:column;gap:18px;margin:26px 0}
.op{display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:30px;padding:14px 26px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.op b{font-size:38px;font-weight:800;color:hsl(var(--h),55%,26%)}.op i{width:90px;height:90px;border-radius:50%;border:5px dashed hsl(var(--h),55%,60%)}
.blank{display:inline-block;width:90px;height:56px;border-radius:16px;border:4px dashed hsl(var(--h),55%,60%);vertical-align:middle;background:#fff}
.ptrk{position:relative;margin-top:24px;background:#fff;border-radius:34px;padding:16px;box-shadow:0 8px 0 hsl(var(--h),50%,75%)}
.ph,.pt{display:grid;grid-template-columns:130px repeat(7,1fr);gap:6px;align-items:center;padding:8px 0}
.pt{border-top:2px dashed hsl(var(--h),50%,85%)}
.ph b{text-align:center;font-size:17px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:12px;padding:2px 0}
.pt span{font-size:26px;font-weight:800;color:hsl(var(--h),55%,28%)}.pt i{height:90px;border-radius:14px;border:3px dashed hsl(var(--h),50%,70%)}
.trace.big{height:140px;margin-top:26px}.trace.big text{font-size:58px}
.man b{padding:14px 10px}
.chip.wide{width:600px;justify-content:center}.chip.wide b{font-size:30px}
.lc{margin-top:22px !important}.lc b.lt{font-size:30px;line-height:1.5}.lc span{font-size:20px;color:#6a6080}
.legend2{position:relative;display:flex;justify-content:center;gap:16px;margin-top:14px}.legend2 svg{width:90px;height:90px}
.mood{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:20px}
.md{background:#fff;border-radius:26px;padding:10px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.md b{display:block;font-size:22px;font-weight:800;color:hsl(var(--h),55%,30%)}.md i{display:block;margin:8px auto 4px;width:120px;height:120px;border-radius:50%;border:4px dashed hsl(var(--h),50%,65%)}
.lawn{position:absolute;left:0;right:0;bottom:0;height:20%;background:linear-gradient(#9be07a,#5cc45a);border-radius:50% 50% 0 0/30% 30% 0 0}
.water{background:radial-gradient(circle at 50% 45%,#ffffff,hsl(var(--h),80%,92%) 70%) !important}
.lc{position:relative;display:flex;align-items:center;gap:16px;margin-top:4px;background:#fff;border-radius:32px;padding:8px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.lc>i{font-style:normal;width:56px;height:56px;border-radius:50%;background:hsl(var(--h),60%,45%);color:#fff;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800}
.lc svg{width:140px;height:140px;flex:none}.lc b{display:block;font-size:34px;font-weight:800;color:hsl(var(--h),55%,28%)}.lc span{font-size:24px;font-weight:700;color:#4a4060}
.arr{text-align:center;font-size:30px;color:hsl(var(--h),50%,45%);line-height:1.1}
.bigboard.garden{background:linear-gradient(#8fd477,#4fb84f)}.bigboard.garden div{background:linear-gradient(#ffffff 70%,#e6f8e0)}
.say{position:absolute;top:24px;right:24px;font-size:38px;font-weight:800;color:hsl(var(--h),70%,30%);background:#fff;border-radius:30px;padding:6px 24px;border:4px solid hsl(var(--h),60%,60%);box-shadow:0 6px 0 hsl(var(--h),50%,70%)}
.say:after{content:'';position:absolute;left:30px;bottom:-22px;border:12px solid transparent;border-top:14px solid hsl(var(--h),60%,60%)}
.ws{position:relative;display:flex;align-items:center;justify-content:space-around;margin-top:26px;background:rgba(255,255,255,.8);border-radius:34px;padding:12px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.ws svg{width:120px;height:120px}
.wsay{min-width:180px;text-align:center;font-size:36px;font-weight:800;color:#fff;background:hsl(var(--h),60%,48%);border-radius:24px;padding:6px 14px;box-shadow:0 5px 0 hsl(var(--h),60%,32%);text-shadow:${ring('hsl(210,60%,22%)', 1.6)}}
.sense{position:relative;display:flex;align-items:center;gap:14px;margin-top:20px;background:#fff;border-radius:32px;padding:6px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.sense>i{font-style:normal;width:52px;height:52px;flex:none;border-radius:50%;background:hsl(var(--h),60%,52%);color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800}
.sense svg{width:120px;height:120px;flex:none}.sense div{flex:1}.sense b{display:block;font-size:34px;font-weight:800;color:hsl(var(--h),55%,30%)}.sense span{font-size:26px;font-weight:700;color:#4a4060}
.mq{width:220px;height:120px;border-radius:28px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;color:hsl(var(--h),60%,28%);box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.crow>svg{width:130px;height:130px;flex:none}.hq{flex:1;font-size:34px;font-weight:800;color:hsl(var(--h),55%,30%)}
.drawface{position:relative;margin:30px auto 0;width:560px;height:620px;border-radius:50%;background:#fff;border:8px solid #f2b48a;box-shadow:0 12px 0 #e0a070,0 24px 30px rgba(80,40,0,.2)}
.drawface i{position:absolute;top:250px;width:70px;height:120px;border-radius:50%;background:#fff;border:8px solid #f2b48a}.drawface .e1{left:-60px}.drawface .e2{right:-60px}
.todayrow{position:relative;display:flex;justify-content:space-around;margin-top:30px;font-size:30px;font-weight:800;color:hsl(var(--h),55%,30%)}
.lrow{position:relative;display:flex;gap:20px;margin-top:26px}
.lb{flex:1;height:170px;background:#fff;border-radius:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.lb svg{width:320px;height:112px}
.bigboard{position:relative;margin:30px auto 0;width:680px;height:600px;border-radius:24px;background:linear-gradient(#c98a4e,#a8693a);padding:22px;box-shadow:0 12px 0 #8b5a2b,0 24px 30px rgba(40,20,80,.25)}
.bigboard div{width:100%;height:100%;border-radius:12px;background:#ffffff;box-shadow:inset 0 0 0 4px #e6ebf3}
.mc.sk svg{width:120px;height:120px;margin-top:10px}
.bigshirt{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:600px;height:600px}
.tank .outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.tank .outline [filter]{display:none}
.tank .outline circle{fill:#fff !important;stroke:#2b2340}
.tank .outline rect,.tank .outline path[fill="#ffffff"]{stroke:#2b2340 !important}
.pat{position:relative;margin-top:22px;background:rgba(255,255,255,.8);border-radius:34px;padding:8px 16px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(40,20,80,.1)}
.seq{display:flex;align-items:center;justify-content:center;gap:4px}.seq svg{width:96px;height:96px}
.q{width:92px;height:92px;border-radius:24px;border:5px dashed hsl(var(--h),60%,60%);display:flex;align-items:center;justify-content:center;font-size:54px;font-weight:800;color:hsl(var(--h),60%,50%)}
.popts{display:flex;justify-content:center;gap:36px;margin-top:6px}.popts div{background:hsl(var(--h),80%,95%);border-radius:50%;padding:4px}.popts svg{width:64px;height:64px}
.sort{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;margin-top:18px}
.sc{display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:28px;padding:6px 10px 14px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.sc svg{width:96px;height:96px}.sc>b{font-size:24px;font-weight:800;color:hsl(var(--h),55%,28%)}
.opts{display:flex;gap:20px;margin-top:6px}.opts span{display:flex;align-items:center;gap:6px;font-size:21px;font-weight:800}
.opts i{width:30px;height:30px;border-radius:8px;border:3px solid hsl(var(--h),50%,55%);background:#fff}
.man{position:relative;display:flex;align-items:center;gap:16px;margin-top:26px;background:#fff;border-radius:34px;padding:12px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 18px rgba(40,20,80,.1)}
.man svg{width:130px;height:130px;flex:none}.man b{flex:1;font-size:30px;font-weight:800;color:hsl(var(--h),55%,28%)}
.mstars{display:flex;gap:8px}.mstars i{width:54px;height:54px;border-radius:14px;border:4px dashed #ffb627}
.todayrow{position:relative;display:flex;justify-content:space-around;margin-top:30px;font-size:30px;font-weight:800;color:hsl(var(--h),55%,30%)}
.crow{position:relative;display:flex;align-items:center;gap:20px;margin-top:30px;background:rgba(255,255,255,.75);border-radius:34px;padding:16px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(10,30,70,.1)}
.cimgs{flex:1;display:flex;justify-content:center;gap:2px}.cimgs svg{width:104px;height:104px}
.cans{width:100px;height:100px;flex:none;border-radius:50%;background:#fff;border:5px dashed hsl(var(--h),60%,60%)}
.match{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}
.mrow{display:flex;align-items:center}
.mc{width:200px;height:150px;border-radius:28px;background:#fff;text-align:center;padding-top:4px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(10,30,70,.12)}
.mc svg{width:116px;height:116px;margin:0 auto}.mc b{font-size:21px;font-weight:800;color:hsl(var(--h),55%,28%);line-height:1}
.shadowimg svg{width:136px;height:136px;margin-top:4px;filter:brightness(0) opacity(.55)}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 10px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.odd{position:relative;display:flex;justify-content:space-around;margin-top:30px;background:rgba(255,255,255,.8);border-radius:34px;padding:16px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.odd svg{width:130px;height:130px}
.mazebox{position:relative;margin:30px auto 0;width:690px;height:820px;border-radius:40px;overflow:hidden;background:linear-gradient(#9fe3ff,#3fb0ec 70%,#1d7fc8);box-shadow:0 8px 0 #1d6fb8,0 16px 24px rgba(10,30,70,.3)}
.mazebox .sand{height:8%}
.mz{position:absolute;left:45px;top:80px;width:600px;height:676px}
.mzs{position:absolute;right:-4px;top:-10px;width:110px;height:110px}.mze{position:absolute;left:-4px;bottom:-14px;width:110px;height:110px}
.tank{position:relative;margin:40px auto 0;width:680px;height:700px;border-radius:30px;border:16px dashed #ffb627;background:#ffffff;overflow:hidden;box-shadow:0 12px 0 #5ab0e0,0 24px 30px rgba(10,30,70,.25)}
.tw{display:none}
.tsand{display:none}
.tc{position:absolute;right:20px;bottom:40px;width:220px;height:220px}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(10,30,70,.15)}
.outline{position:absolute}
.c1{width:440px;height:440px;left:20px;top:40px}.c2{width:340px;height:340px;left:20px;bottom:20px}.c3{width:300px;height:300px;right:40px;bottom:60px}
.colorbox .outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.colorbox .outline [filter]{display:none}
.colorbox .outline rect:not([fill^="url"]){fill:#fff !important;stroke:#2b2340;stroke-width:1.4}
.colorbox .outline circle:not([fill^="url"]):not([fill="#fff"]):not([fill="#2b2340"]){fill:#fff !important;stroke:#2b2340;stroke-width:1.4}
.colorbox .outline path[fill="none"],.colorbox .outline circle[fill="none"]{stroke:#2b2340 !important;stroke-width:2 !important}
.ref{position:absolute;top:18px;right:18px;width:120px;text-align:center;border-radius:24px;background:hsl(var(--h),90%,95%);padding:6px}
.ref svg{width:80px;height:80px;margin:0 auto}.ref small{font-size:15px;font-weight:800;color:hsl(var(--h),55%,30%)}
/* certificate */
.cert{--h:45;background:radial-gradient(circle at 50% 30%,#fffbe6,#ffe08a 60%,#ffc23d);padding:40px}
.frame{position:relative;height:100%;border-radius:40px;border:10px solid #fff;outline:6px dashed #ffb300;outline-offset:-24px;text-align:center;padding-top:60px;box-shadow:0 12px 30px rgba(150,90,0,.3),inset 0 0 40px rgba(255,255,255,.7)}
.medal{width:230px;height:230px;margin:0 auto;filter:drop-shadow(0 10px 10px rgba(120,70,0,.3))}
.cert h2{font-size:88px}
.cp{font-size:31px;font-weight:700;color:#8a5200;margin-top:14px;line-height:1.7}
.certart{display:flex;justify-content:center;gap:10px;margin-top:10px}.certart svg{width:150px;height:150px}
.sig{display:flex;justify-content:space-around;margin-top:24px;font-size:22px;font-weight:700;color:#8a5200}
.cert .pno{bottom:56px}
`;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>أخلاق المسلم الصغير</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
