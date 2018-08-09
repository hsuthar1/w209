library(reshape2)

df <- read.csv('/Users/Himal/Downloads/World_Disease_2004.csv')


head(df)

names(df) = tolower(names(df))

df1 = melt(df, id.vars = c("population...000...e.", "lower.uncertainty.bound..f.", "upper.uncertainty.bound..f.", "nations", "countries", "codes"))

df1 = df1[!(df1$variable %in% c('f1', 'all.causes', 'injuries', 'communicable..maternal..perinatal.and.nutritional.conditions', 'noncommunicable.diseases')), ]

df1$variable = factor(df1$variable)

df1$codlvl2 = ifelse(df1$variable %in% c('violence', 'self.inflicted.injuries'), 'intentional.injuries', 
                       ifelse(df1$variable %in% c('road.traffic.accidents', 'poisonings', 'falls', 'fires', 'drownings', 'other.unintentional.injuries'), 'unintentional.injuries',
                              ifelse(df1$variable %in% c('dental.caries', 'periodontal.disease', 'edentulism'), 'oral.conditions',
                                     ifelse(df1$variable %in% c('congenital.anomalies'), 'congenital.anomalies',
                                            ifelse(df1$variable %in% c('osteoarthritis', 'rheumatoid.arthritis'), 'musculoskeletal.diseases',
                                                   ifelse(df1$variable %in% c('skin.diseases'), 'skin.diseases',
                                                          ifelse(df1$variable %in% c('nephritis.and.nephrosis', 'benign.prostatic.hypertrophy'), 'genitourinary.diseases',
                                                                 ifelse(df1$variable %in% c('peptic.ulcer.disease', 'cirrhosis.of.the.liver', 'appendicitis'), 'digestive.disease',
                                                                        ifelse(df1$variable %in% c('chronic.obstructive.pulmonary.disease', 'asthma'), 'respiratory.diseases',
                                                                               ifelse(df1$variable %in% c('rheumatic.heart.disease', 'hypertensive.heart.disease', 'ischaemic.heart.disease', 'cerebrovascular.disease', 'inflammatory.heart.diseases..k.'), 'cardiovascular.diseases',
                                                                                      ifelse(df1$variable %in% c('glaucoma', 'cataracts', 'refractive.errors', 'hearing.loss..adult.onset', 'macular.degeneration.and.other..j.'), 'sense.organ.diseases',
                                                                                             ifelse(df1$variable %in% c('unipolar.depressive.disorders', 'bipoolar.disorder', 'schizophrenia', 'epilepsy', 'alcohol.use.disorders', 'alzheimer.and.other.dementias', 'parkinson.disease', 'multiple.sclerosis', 'drug.use.disorders', 'post.traumatic.stress.disorder', 'obsessive.compulsive.disorder', 'panic.disorder', 'insomnia..primary.', 'migraine'), 'neuropsychiatric.conditions',
                                                                                                    ifelse(df1$variable %in% c('endocrine.disorders'), 'endocrine.disorders',
                                                                                                           ifelse(df1$variable %in% c('diabetes.mellitus'), 'diabetes.mellitus',
                                                                                                                  ifelse(df1$variable %in% c('other.neoplasms'), 'other.neoplasms',
                                                                                                                         ifelse(df1$variable %in% c('mouth.and.oropharynx.cancers', 'oesophagus.cancer', 'stomach.cancer', 'colon.and.rectum.cancers', 'liver.cancer', 'pancreas.cancer', 'trachea..bronchus..lung.cancers', 'melanoma.and.other.skin.cancers', 'breast.cancer', 'cervix.uteri.cancer', 'corpus.uteri.cancer', 'ovary.cancer', 'prostate.cancer', 'bladder.cancer', 'lymphomas..multiple.myeloma', 'leukaemia'), 'malignant.neoplasms',
                                                                                                                                ifelse(df1$variable %in% c('protein.energy.malnutrition', 'iodine.deficiency', 'vitamin.a.deficiency', 'iron.deficiency.anaemia'), 'nutritional.deficiencies',
                                                                                                                                       ifelse(df1$variable %in% c('prematurity.and.low.birth.weight', 'birth.asphyxia.and.birth.trauma', 'neonatal.infections.and.other.conditions..i.'), 'perinatal.conditions..h.',
                                                                                                                                              ifelse(df1$variable %in% c('maternal.conditions'), 'maternal.conditions',
                                                                                                                                                     ifelse(df1$variable %in% c('lower.respiratory.infections', 'upper.respiratory.infections', 'otitis.media'), 'respiratory.infections',
                                                                                                                                                            ifelse(df1$variable %in% c('intestinal.nematode.infections', 'trachoma', 'japanese.encephalitis', 'dengue', 'leprosy', 'tropical.cluster.diseases', 'malaria', 'hepatitis.b..g.', 'hepatitis.c..g.', 'meningitis', 'childhood.cluster.diseases', 'diarrhoeal.diseases', 'hiv.aids', 'stds.excluding.hiv', 'tuberculosis'), 'infectious.and.parasitic.diseases',
                                                                                                                                                                   'SKIP'))))))))))))))))))))) 

df1 = df1[which(df1$codlvl2 != 'SKIP'), ]

df1$codlvl1 = ifelse(df1$codlvl2 %in% c('intentional.injuries', 'unintentional.injuries'), 'injuries', 
         ifelse(df1$codlvl2 %in% c('oral.injuries', "congenital.anomalies", "musculoskeletal.diseases", "skin.diseases", "genitourinary.diseases", "digestive.disease", "respiratory.diseases", "cardiovascular.diseases", "sense.organ.diseases", "neuropsychiatric.conditions", "endocrine.disorders", "diabetes.mellitus", "other.neoplasms", "malignant.neoplasms"), "noncommunicable.disases",
         'communicable..maternal..perinatal.and.nutritional.conditions'))

write.csv(df1, '/Users/Himal/Downloads/209final.csv')
         