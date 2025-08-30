function getPaymentInstructions(lang) {
  if (lang.startsWith('am')) {
    return `
💵 እባክዎ ገንዘብ ወደ አንዱ ከሚከተሉት መንገዶች ያስተላልፉ፦

🏦 *CBE ባንክ*  
መለያ ቁጥር፡ 1000316113347

📱 *CBE Birr*  
ስልክ ቁጥር፡ 0920927761

📱 *Telebirr*  
ስልክ ቁጥር፡ 0920927761

ከዚያ በኋላ፣ /confirm <መጠን> <ሪፈረንስ> ይላኩ።
`;
  } else {
    return `
💵 Please send money to one of the following accounts:

🏦 *CBE Bank*  
Account Number: 1000316113347

📱 *CBE Birr*  
Phone Number: 0920927761

📱 *Telebirr*  
Phone Number: 0920927761

Then reply with:
/confirm <amount> <reference>
`;
  }
}

module.exports = getPaymentInstructions;
