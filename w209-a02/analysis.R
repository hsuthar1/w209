setwd("C:/Users/yangyq/workspaces/ucbiyyq/w209/w209-a02")
getwd()

# Online Dating and Relationships
# http://annettegreiner.com/vizcomm/Dating.csv
# From the Pew Research Center's Internet and American Life Spring Tracking Survey, April 17-May 19, 2013. 
# N=2,252 adults ages 18+. 
# Interviews were conducted in English and Spanish and on landline and cell phones. 
# This is a national survey of dating and relationships in the digital era, the first dedicated study of this subject by the Pew Research Center’s Internet Project since 2005. 
# A list of the  Survey questions is  available for download as a PDF.
#
# for original, see
# http://www.pewinternet.org/dataset/may-2013-online-dating/


library(data.table)

dt <- data.table( read.csv("Dating.csv", na.string=c("NA"," ")) )
dt[,state:=as.factor(state)]
dt[,emplnw:=as.factor(emplnw)]
dt[,income:=as.factor(income)]
dt[,years_in_relationship:=as.integer(as.character(years_in_relationship))]
dt[,adults_in_household:=as.integer(as.character(adults_in_household))]
dt[,used_dating_site:=factor(used_dating_site,levels(used_dating_site)[c(4,2,1,3)])]


sort(colnames(dt))

str(dt)

dt[,barplot(table(state))]
dt[,barplot(table(region))]
dt[,barplot(table(usr))]
dt[,barplot(table(sex))]

dt[,barplot(table(life_quality))]

dt[,barplot(table(use_internet))]
dt[,barplot(table(use_email))]
dt[,barplot(table(use_social_networking))]
dt[,barplot(table(use_twitter))]
dt[,barplot(table(use_reddit))]
dt[,barplot(table(googled_own_name))]

dt[,barplot(table(have_cell_phone))]
dt[,barplot(table(have_smart_phone))]
dt[,barplot(table(have_tablet))]

dt[,barplot(table(marital_status))]
dt[,barplot(table(in_relationship))]
dt[,hist(years_in_relationship,breaks=100)]
summary(dt$years_in_relationship)
dt[,barplot(table(looking_for_partner))]
dt[,barplot(table(met_partner_online))]
dt[,barplot(table(searched_for_ex_online))]
dt[,barplot(table(flirted_online))]
dt[,barplot(table(used_dating_site))]
summary(dt$used_dating_site)
levels(dt$used_dating_site)

dt[,hist(age)]
summary(dt$age)

dt[,barplot(table(have_children))]
dt[,hist(children0_5,breaks=100)]
summary(dt$children0_5)
dt[,hist(children6_11,breaks=100)]
summary(dt$children6_11)
dt[,hist(children12_17,breaks=100)]
summary(dt$children12_17)
dt[,hist(adults_in_household)]
summary(dt$adults_in_household)

dt[,barplot(table(educ2))]
dt[,barplot(table(emplnw))]
dt[,barplot(table(race))]
dt[,barplot(table(income))]
levels(dt$income)
dt[,barplot(table(lgbt))]

dt[,hist(weight)]
dt[,hist(standwt)]



# Q1	Overall, how would you rate the quality of life for you and your family today? Would you say it is... excellent, very good, good, fair or poor?
# 1	Excellent
# 2	Very good
# 3	Good
# 4	Fair
# 5	Poor
# 8	(DO NOT READ) Don’t know
# 9	(DO NOT READ) Refused


# EDUC2	What is the highest level of school you have completed or the highest degree you have received? [DO NOT READ] [INTERVIEWER NOTE: Enter code 3-HS grad if R completed training that did NOT count toward a degree]
# 1	Less than high school (Grades 1-8 or no formal schooling)
# 2	High school incomplete (Grades 9-11 or Grade 12 with NO diploma)
# 3	High school graduate (Grade 12 with diploma or GED certificate)
# 4	Some college, no degree (includes some community college)
# 5	Two year associate degree from a college or university
# 6	Four year college or university degree/Bachelor’s degree (e.g., BS, BA, AB)
# 7	Some postgraduate or professional schooling, no postgraduate degree
# 8	Postgraduate or professional degree, including master’s, doctorate, medical or law degree (e.g., MA, MS, PhD, MD, JD)
# 98	Don’t know
# 99	Refused


# EMPLNW	Are you now employed full-time, part-time, retired, or are you not employed for pay? {PIAL trend}
# 1	Employed full-time
# 2	Employed part-time
# 3	Retired
# 4	Not employed for pay
# 5	(VOL.) Have own business/self-employed
# 6	(VOL.) Disabled
# 7	(VOL.) Student
# 8	(VOL.) Other
# 9	(DO NOT READ) Refused




# INC	Last year -- that is in 2012 -- what was your total family income from all sources, before taxes? Just stop me when I get to the right category... [READ 1-9] {Master INC2}
# 1	Less than $10,000
# 2	10 to under $20,000
# 3	20 to under $30,000
# 4	30 to under $40,000
# 5	40 to under $50,000
# 6	50 to under $75,000
# 7	75 to under $100,000
# 8	100 to under $150,000
# 9	$150,000 or more
# 98	(DO NOT READ) Don’t know
# 99	(DO NOT READ) Refused


dt$used_dating_site
as.integer(dt$used_dating_site)

temp <- dt[
    !(income %in% c(98, 99)) & marital_status != "Refused" & !is.na(used_dating_site)
     ,.(income,marital_status,used_dating_site)
][
    ,lm(as.integer(used_dating_site) ~ as.integer(as.character(income)) + as.integer(marital_status))
]

temp

temp2 <- dt[
    ,.(income,marital_status,used_dating_site)
    ][
        ,lm(as.integer(used_dating_site) ~ as.integer(as.character(income)) + as.integer(marital_status))
]

temp2
summary(temp2)


temp3 <- dt[
        ,lm(as.integer(used_dating_site) ~ income + marital_status + use_internet + in_relationship + looking_for_partner)
]

summary(temp3)