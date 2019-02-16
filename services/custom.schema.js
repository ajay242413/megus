var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');
var Schema = mongoose.Schema, ObjectId  = Schema.ObjectId;
var connObj = require('./conn.service').createConnectionDB();

function deleteEmpty(v) {
   if(v == null){
     return undefined;
   }
   return v;
}

var schemaService = {};

/*MASTER SCHEMAS*/
var masterStateSchema = new Schema({
  country: {type:Schema.Types.ObjectId, ref:'master_country', autopopulate:{select:'name'}},
  name: {type: String,required: true},
  code: {type: String},
  gstCode: {type: String,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});
masterStateSchema.plugin(autopopulate);

var masterRegionSchema = new Schema({
  name: {type: String,required: true},
  district:{type:Schema.Types.ObjectId, ref:'master_district', autopopulate:{select:'name'}},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});
masterRegionSchema.plugin(autopopulate);

//Zone only shown to brand panel
var masterZoneSchema = new Schema({
  name: {type: String,required: true},
  district: [{type:Schema.Types.ObjectId, ref:'master_district', autopopulate:{select:'name'}}],
  state: {type:Schema.Types.ObjectId, ref:'master_state', autopopulate:{select:'name'}},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});
masterZoneSchema.plugin(autopopulate);

var masterDistrictSchema = new Schema({
  name: {type: String,required: true},
  code: {type: String},
  state: {type:Schema.Types.ObjectId, ref:'master_state', autopopulate:{select:'name'}},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});
masterDistrictSchema.plugin(autopopulate);

//Area will be unique for all
var masterAreaSchema = new Schema({
  district: {type:Schema.Types.ObjectId, ref:'master_district', autopopulate:{select:'name'}},
  code: {type: String},
  name: {type: String,required: true},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});
masterAreaSchema.plugin(autopopulate);

var masterCountrySchema = new Schema({
  code: {type: String},
  name: {type: String,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

var masterCitySchema = new Schema({
  code: {type: String},
  name: {type: String,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

var masterUnitSchema = new Schema({
  code: {type: String},
  name: {type: String,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

var masterSalePointSchema = new Schema({
  code: {type: String},
  name: {type: String,required: true},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

var masterProductTypeSchema = new Schema({
  category: {type: String,required: true},
  tax: {type: String},
  taxRate: {type: Number},
  type: {type: String,required: true},
  code: {type: String,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

var masterProductNameSchema = new Schema({
  name: {type: String,required: true},
  unit: {type:Schema.Types.ObjectId, ref:'master_unit', set:deleteEmpty, autopopulate:{select:'name'}},
  type: {type:Schema.Types.ObjectId, ref:'master_productType', set:deleteEmpty, autopopulate:{select:'taxRate type code tax'}},
  IMEINumLen : {type: Number, set: deleteEmpty},
  IMEINumCount: {type: Number},
  attribute: [{type:Schema.Types.ObjectId, ref:'master_productAttribute', set:deleteEmpty, autopopulate:{select:'name value'}}],
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});
masterProductNameSchema.plugin(autopopulate);

var masterProductBrandSchema = new Schema({
  code: {type: String},
  name: {type: String,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

var itemAttributeSchema = new Schema({
  name: {type:Schema.Types.ObjectId, ref:'master_productAttribute', set:deleteEmpty, autopopulate:{select:'name value'}},
  value: {type:Schema.Types.ObjectId},
  status: {type: Boolean}
}, {_id:false}, {versionKey:false});

var masterProductItemSchema = new Schema({
  brandName : {type:Schema.Types.ObjectId, ref:'master_productBrand', set:deleteEmpty, autopopulate:{select:'name'}},
  prodName : {type:Schema.Types.ObjectId, ref:'master_productName', set:deleteEmpty, autopopulate:{select:'IMEINumCount name type IMEINumLen unit attribute'}},
  itemName : {type: String},
  name : {type: String},
  itemCode : {type: Number},
  IMEINumLen : {type: Number},
  sellPrice : {type: Number},
  costPrice : {type: Number},
  inventType : {type: String},
  attribute: [itemAttributeSchema],
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});
masterProductItemSchema.plugin(autopopulate);

var attributeValueSchema = new Schema({
  name: {type: String},
  active: {type: Boolean}
}, {versionKey: false});

var masterProductAttributeSchema = new Schema({
  name: {type: String},
  value: {type: [attributeValueSchema]},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
}, {versionKey: false});

var masterSupplierCategorySchema = new Schema({
  code: {type: String},
  name: {type: String,required: true},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

var contactSchema = new Schema({
  name : {type: String,required: true},
  phone : {type: Number,required: true},
  department : {type:Schema.Types.ObjectId, ref:'master_clientDepartment', set:deleteEmpty, autopopulate:{select:'name code'}},
  email : {type: String},
  designation : {type:Schema.Types.ObjectId, ref:'master_clientDesignation', set:deleteEmpty, autopopulate:{select:'name code'}}
},{versionKey: false});
contactSchema.plugin(autopopulate);

var masterSupplierSchema = new Schema({
  name : {type: String, required: true},
  code: {type: Number},
  mobNum : {type: Array, required: true},
  email : {type: String,required: true},
  gstin : {type: String, required: true},
  panID: {type: String},
  category1 : {type:Schema.Types.ObjectId, ref:'master_supplierCategory', set:deleteEmpty, autopopulate:{select:'name code'}},
  category2 : {type:Schema.Types.ObjectId, ref:'master_supplierCategory', set:deleteEmpty, autopopulate:{select:'name code'}},
  address : {type: String},
  landmark : {type: String},
  area : {type:Schema.Types.ObjectId, ref:'master_area', set:deleteEmpty, autopopulate:{select:'name'}},
  city : {type:Schema.Types.ObjectId, ref:'master_city', set:deleteEmpty, autopopulate:{select:'name'}},
  state : {type:Schema.Types.ObjectId, ref:'master_state', set:deleteEmpty, autopopulate:{select:'name gstCode'}},
  country : {type:Schema.Types.ObjectId, ref:'master_country', set:deleteEmpty, autopopulate:{select:'name'}},
  contact : [contactSchema],
  authorID: {type: Schema.Types.ObjectId},
  createdBy: {type: Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});
masterSupplierSchema.plugin(autopopulate);

var masterDepartmentSchema = new Schema({
  code : {type: String},
  name : {type: String,required: true},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

var permissionGeneralSchema = new Schema({
  view: {type: Boolean},
  new: {type: Boolean},
  edit: {type: Boolean},
  delete: {type: Boolean}
},{_id: false},{versionKey: false});

var permissionMasterSchema = new Schema({
  master: permissionGeneralSchema,
  client: permissionGeneralSchema,
  product: permissionGeneralSchema,
  supplier: permissionGeneralSchema,
  accounts: permissionGeneralSchema,
  hr: permissionGeneralSchema,
  generalMaster: permissionGeneralSchema
},{_id: false},{versionKey: false});

var permissionHrSchema = new Schema({
  hr: permissionGeneralSchema,
  employee: permissionGeneralSchema,
  expense: permissionGeneralSchema
},{_id: false},{versionKey: false});

var permissionIventorySchema = new Schema({
  inventory: permissionGeneralSchema,
  purchaseOrder: permissionGeneralSchema,
  purchaseOrderManagement: permissionGeneralSchema,
  purchaseAck: permissionGeneralSchema,
  sales: permissionGeneralSchema,
  salesOrder: permissionGeneralSchema,
  salesOrderManagement: permissionGeneralSchema,
  stockTransfer: permissionGeneralSchema,
  stockStatus: permissionGeneralSchema,
  stockRegister: permissionGeneralSchema
},{_id: false},{versionKey: false});

var permissionAccountsSchema = new Schema({
  accounts: permissionGeneralSchema,
  ledger: permissionGeneralSchema,
  accountStatement: permissionGeneralSchema,
  receiptVoucher: permissionGeneralSchema,
  paymentVoucher: permissionGeneralSchema,
  journal: permissionGeneralSchema,
  contra: permissionGeneralSchema,
  debitNote: permissionGeneralSchema,
  creditNote: permissionGeneralSchema
},{_id: false},{versionKey: false});

var permissionSchema = new Schema({
  master: permissionMasterSchema,
  hr: permissionHrSchema,
  inventory: permissionIventorySchema,
  accounts: permissionAccountsSchema,
  authorID: {type: Schema.Types.ObjectId}
},{_id: false},{versionKey: false});

var masterDesignationSchema = new Schema({
  code : {type: String},
  name : {type: String,required: true},
  permission : permissionSchema,
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

var masterHierarchySchema = new Schema({
  level : {type: String},
  name : {type: String,required: true},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false})

//active - to handle deletion
//status - to handle current financial year
var masterFinancialYearSchema = new Schema({
  finyear: {type: String,required: true},
  fromDate: {type: String,required: true},
  toDate: {type: String,required: true},
  status: {type: Boolean,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean,required: true}
},{versionKey: false});

var masterLedgerSchema = new Schema({
  name: {type: String,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean,required: true}
},{versionKey: false});
masterLedgerSchema.add({subName: [masterLedgerSchema]});

var masterVisitTypeSchema = ({
  code : {type: String},
  name : {type: String},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
});

var masterDealerCategorySchema = new Schema({
  code: {type: String},
  name: {type: String,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});

//INVENTORY SCHEMA
var inventoryItemSchema = new Schema({
  name: {type:Schema.Types.ObjectId, ref:'master_productItem', autopopulate:{select:'itemName name itemCode brandName prodName IMEINumLen sellPrice costPrice'}},
  quantity: {type: Number},
  cost: {type: Number},
  sgst: {type: Number},
  cgst: {type: Number},
  igst: {type: Number},
  total: {type: Number},
  IMEINumber: {type: Object}
},{versionKey: false},{_id: false});
inventoryItemSchema.plugin(autopopulate);

var inventoryItemCloneSchema = new Schema({
  name: {type:Schema.Types.ObjectId},
  quantity: {type: Number},
  IMEINumber: {type: Object}
},{versionKey: false},{_id: false});
inventoryItemCloneSchema.plugin(autopopulate);

var inventorySchema = new Schema({
  code: {type: Number},
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  billno: {type: String},
  billDate: {type: String},
  category: [{type:Schema.Types.ObjectId, ref:'master_productName', autopopulate:{select:'name'}}],
  party: {type:Schema.Types.ObjectId, refPath:'partyType', autopopulate:{select:'-finanace2 -finanace1 -priceTemplate -creditDays -creditLimit -category -bank -manager -owner -pincode -region -district -phoneno -contact -country -city -area -landmark -address -category2 -category1 -email -mobNum -permission -firmType -gstin -panID -firm -registerAddress -billingAddress -areaDistribution -bankDetails -proofs -partnerType -creditLimit -creditDays -priceTemplate -overDue -guaranteeLimit -validityStart -validityEnd -active -activateAccount -signupMail -employeeID -createdBy -creationTime -modifiedBy -modifiedTime -modifiedDate -salesperson'}},
  item: [inventoryItemSchema],
  itemClone: [inventoryItemCloneSchema],
  partyType: {type: String},
  invenType: {type: String},
  salePoint: {type:Schema.Types.ObjectId, ref:'master_salePoint', autopopulate:{select:'name'}},
  remark: {type: String},
  source: {type:Schema.Types.ObjectId, ref:'master_salePoint', autopopulate:{select:'name'}},
  creditDays: {type: Number},
  paymentType: {type: String},
  IGST: {type: Number},
  CGST: {type: Number},
  SGST: {type: Number},
  totalQuantity: {type: Number},
  grossValue: {type: Number},
  netValue: {type: Number},
  rndOFF: {type: String},
  ack: {type: Number},
  dcID: {type: Schema.Types.ObjectId},
  invenID: [{type: Schema.Types.ObjectId, ref: 'inventory', autopopulate:{select:'-code -billno -billDate -category -party -item -invenType -salePoint -remark -source -creditDays -paymentType -IGST -CGST -SGST -totalQuantity -grossValue -netValue -rndOFF -ack -ackID -dcID -authorID -active -createdBy -creationTime -modifiedBy -creationTime -modifiedBy -modifiedTime -modifiedDate'}}],
  authorID: {type:Schema.Types.ObjectId, ref:'user', autopopulate:{select:'-password -email -modifiedBy -modifiedDate -modifiedTime -createdBy -creationTime -active'}},
  active: {type: Boolean},
  createdBy: {type: Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
inventorySchema.plugin(autopopulate);

var IMEInumberSchema = new Schema({
  IMEI: {type: []},
  boxno: {type: String},
  pp: {type: String},
  ps: {type: String},
  sp: {type: String},
  ss: {type: String}
},{_id: false},{versionKey: false});
IMEInumberSchema.plugin(autopopulate);

var stockStatusSchema = new Schema({
  name: {type:Schema.Types.ObjectId, ref:'master_productItem', autopopulate:{select:'itemName name prodName itemCode'}},
  quantity: {type: Number},
  IMEINumber: [IMEInumberSchema],
  authorID: {type: Schema.Types.ObjectId, ref:'user', autopopulate:{select:'-password -createdBy -creationTime -email -modifiedBy -modifiedDate -modifiedTime'}},
  createdBy: {type: Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  salePoint: {type:Schema.Types.ObjectId, ref:'master_salePoint', autopopulate:{select:'name'}}
},{versionKey: false});
stockStatusSchema.plugin(autopopulate);

var IMEIcustomerSchema = new Schema({
  id: {type: String},
  imei: {type: String},
  circle: {type: String},
  date: {type: String},
  model: {type: String},
  msisdn: {type: String},
  operator: {type: String},
  push_msg: {type: String}
},{_id: false},{versionKey: false});

var imeiBDDschema = new Schema({
  // author: {type: Schema.Types.ObjectId,ref: 'user',autopopulate: true},
  author: {type: Schema.Types.ObjectId},
  date: {type: String},
  refID: {type: Schema.Types.ObjectId,ref: 'inventory',autopopulate:{select:'-item -category -totalQuantity -netValue -grossValue -CGST -SGST -IGST -paymentType -salePoint -code -billno -remark -billDate -createdBy -creationTime -active -authorID -creditDays -rndOFF -source'}}
},{_id: false},{versionKey: false});
imeiBDDschema.plugin(autopopulate);

var IMEIschema = new Schema({
  model: {type:Schema.Types.ObjectId, ref:'master_productItem', autopopulate:{select:'itemName name'}},
  IMEI: {type: []},
  boxno: {type: String},
  active: {type: Boolean},
  activeDate: {type: String},
  createdBy: {type: Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  pdc: [imeiBDDschema],
  sdc: [imeiBDDschema],
  brand: [imeiBDDschema],
  sales: [imeiBDDschema],
  rds: [imeiBDDschema],
  dealer: [imeiBDDschema],
  customer: [IMEIcustomerSchema],
  salesReturn: [imeiBDDschema],
  purchaseReturn: [imeiBDDschema],
  rdsSalesReturn: [imeiBDDschema],
  rdsPurchaseReturn: [imeiBDDschema],
  position: {type: String},
  brandTransfer: [imeiBDDschema],
  rdsTransfer: [imeiBDDschema]
},{versionKey: false});
IMEIschema.plugin(autopopulate);

var salesReportItemSchema = new Schema({
  name: {type: Schema.Types.ObjectId, ref:'master_productItem', autopopulate:{select:'itemName name'}},
  quantity: {type: Number}
},{_id: false},{versionKey: false});
salesReportItemSchema.plugin(autopopulate);

var salesReportSchema = new Schema({
  item: [salesReportItemSchema],
  type: {type: String},
  clientID: {type: Schema.Types.ObjectId}
},{versionKey: false});
salesReportSchema.plugin(autopopulate);

/*CLIENT SCHEMAS*/
var clientFirmSchema = new Schema({
  name: {type: String},
  phone: {type: Number},
  address: {type: String},
  mail: {type: String},
  panID: {type: String}
},{versionKey: false});

var clientAddressSchema = new Schema({
  address: {type: String,required: true},
  state: {type:Schema.Types.ObjectId, ref:'master_state', autopopulate:{select:'name gstCode'}},
  pincode: {type: Number,required: true},
  phoneno: {type: String,required: true},
  mail: {type: String,required: true}
},{_id: false},{versionKey: false});
clientAddressSchema.plugin(autopopulate);

var clientAreaDistSchema = new Schema({
  state: {type:Schema.Types.ObjectId, ref:'master_state', autopopulate:{select:'name gstCode'}},
  district: {type:Schema.Types.ObjectId, ref:'master_district', autopopulate:{select:'name'}},
  region: {type:Schema.Types.ObjectId, ref:'master_region', autopopulate:{select:'district name'}}
},{_id: false},{versionKey: false});
clientAreaDistSchema.plugin(autopopulate);

var clientBankDetailSchema = new Schema({
  accountNumber: {type: String},
  accountName: {type: String},
  accountType: {type: String},
  ifsc: {type: String},
  micr: {type: String},
  bankName: {type: String},
  branchName: {type: String},
  branchAddress: {type: String},
  contactNumber: {type: String},
  emailId: {type: String},
  ccLimit: {type: String}
},{_id: false},{versionKey: false});

var clientProofSchema = new Schema({
  panProof: {type: String},
  gstRegProof: {type: String},
  partnerDeedProof: {type: String},
  firmAddressProof: {type: String},
  auditedBalanceProof: {type: String},
  idProof: {type: String},
  firmPhoto: {type: String},
  bankStatementProof: {type: String},
  aadharProof: {type: String}
},{ _id : false },{versionKey: false});

var clientSchema = new Schema({
  name: {type: String},
  code: {type: Number},
  permission : permissionSchema,
  firmType: {type: String},
  gstin: {type: String},
  panID: {type: String},
  latitude: {type: Number},
  longitude: {type: Number},
  firm: [clientFirmSchema],
  registerAddress: clientAddressSchema,
  billingAddress: clientAddressSchema,
  shippingAddress: clientAddressSchema,
  areaDistribution: clientAreaDistSchema,
  bankDetails: clientBankDetailSchema,
  proofs: clientProofSchema,
  partnerType: {type: String},
  creditLimit: {type: Number},
  creditDays: {type: Number},
  priceTemplate: {type: String},
  overDue: {type: Boolean},
  guaranteeLimit: {type: Number},
  validityStart: {type: String},
  validityEnd: {type: String},
  active: {type: Boolean},
  activateAccount: {type: Boolean},
  signupMail: {type: String},
  authorID: {type: Schema.Types.ObjectId},
  employeeID: {type: Schema.Types.ObjectId},
  createdBy: {type: Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  salesperson: [{type:Schema.Types.ObjectId, ref:'employee', autopopulate:{select:'name'}}]
},{versionKey: false});
clientSchema.plugin(autopopulate);

var ownerSchema = new Schema({
  name: {type: String},
  mail: {type: String},
  phoneno: {type: String},
  address: {type: String}
},{_id: false},{versionKey: false});

var dealerSchema = new Schema({
  name: {type: String},
  code: {type: Number},
  email: {type: String},
  phoneno: {type: String},
  gstin: {type: String},
  panID: {type: String},
  address: {type: String},
  area: {type:Schema.Types.ObjectId, ref:'master_area', autopopulate:{select:'name'}, set:deleteEmpty},
  district: {type:Schema.Types.ObjectId, ref:'master_district', autopopulate:{select:'name'}, set:deleteEmpty},
  region: {type:Schema.Types.ObjectId, ref:'master_region', autopopulate:{select:'name district'}, set:deleteEmpty},
  state: {type:Schema.Types.ObjectId, ref:'master_state', autopopulate:{select:'name gstCode'}, set:deleteEmpty},
  country: {type:Schema.Types.ObjectId, ref:'master_country', autopopulate:{select:'name'}, set:deleteEmpty},
  pincode: {type: String},
  owner: ownerSchema,
  manager: ownerSchema,
  bank: clientBankDetailSchema,
  category: {type:Schema.Types.ObjectId, ref:'master_dealerCategory', autopopulate:{select:'name'}, set:deleteEmpty},
  creditLimit: {type: Number},
  creditDays: {type: Number},
  priceTemplate: {type: String},
  activateAccount: {type: Boolean},
  signupMail: {type: String},
  overDue: {type: Boolean},
  salesperson: {type:Schema.Types.ObjectId, ref:'employee', autopopulate:{select:'name'}, set:deleteEmpty},
  finanace1: {type: String},
  finanace2: {type: String},
  // workforce: {type: Boolean},
  latitude: {type: Number},
  longitude: {type: Number},
  active: {type: Boolean},
  authorID: {type:Schema.Types.ObjectId, ref:'user',autopopulate:{select:'-password -email -modifiedBy -modifiedDate -modifiedTime -createdBy -creationTime -active'}},
  createdBy: {type: Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
},{versionKey: false});
dealerSchema.plugin(autopopulate);

//Expenses Schemas
var expenseInfoSchema = new Schema({
  type: {type: String},
  date: {type: String},
  remark: {type: String},
  cost: {type: Number},
  approve: {type: Boolean},
  file: {type: String},
  expenseInfo: {type: Object},
  approveDate: {type : String}
},{versionKey: false});

var expenseSchema = new Schema({
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  expenses: [expenseInfoSchema],
  approve: {type: Boolean},
  employee: {type:Schema.Types.ObjectId, ref: 'employee', autopopulate:{select: 'name'}},
  jp: {type:Schema.Types.ObjectId, ref:'hrEvent', autopopulate:{select: 'plan'}},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
expenseSchema.plugin(autopopulate);

var journeyPlanSchema = new Schema({
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  name: {type: String},
  visitType: {type:Schema.Types.ObjectId, ref:'master_visitType',autopopulate:{select: 'name'}},
  dealer: [{type:Schema.Types.ObjectId, ref:'dealer', autopopulate:{select: 'name state district category'}}],
  photo: {type: Boolean},
  checkin: {type: Boolean},
  label1: {type: Boolean},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
journeyPlanSchema.plugin(autopopulate);

var hrEventSchema = new Schema({
  hr: {type:Schema.Types.ObjectId, ref:'employee', autopopulate:{select: 'name department'}},
  plan: {type:Schema.Types.ObjectId, ref:'journeyPlan', autopopulate:{select: 'name'}},
  // start: {type: Date},
  // end: {type: Date},
  start: {type: String},
  end: {type: String},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId}
},{versionKey: false});
hrEventSchema.plugin(autopopulate);

//HR Schemas
var employeeFileSchema = new Schema({
  proof: {type: String},
  photo: {type: String}
},{_id: false},{versionKey: false});

var employeeProfileSchema = new Schema({
  name: {type: String},
  country: {type:Schema.Types.ObjectId, ref:'master_country', set:deleteEmpty, autopopulate:{select:'name'}},
  state: {type:Schema.Types.ObjectId, ref:'master_state', set:deleteEmpty, autopopulate:{select:'name gstCode'}},
  city: {type:Schema.Types.ObjectId, ref:'master_city', set:deleteEmpty, autopopulate:{select:'name'}},
  area: {type:Schema.Types.ObjectId, ref:'master_area', set:deleteEmpty, autopopulate:{select:'name'}},
  pincode: {type: String},
  address: {type: String}
}, {_id:false}, {versionKey: false});
employeeProfileSchema.plugin(autopopulate);

var employeeSchema = new Schema({
  name: {type: String},
  mobNum: {type: Number},
  panID: {type: String},
  email: {type: String},
  address: {type: String},
  pincode: {type: String},
  area: {type:Schema.Types.ObjectId, ref:'master_area', set:deleteEmpty, autopopulate:{select:'name'}},
  city: {type:Schema.Types.ObjectId, ref:'master_city', set:deleteEmpty, autopopulate:{select:'name'}},
  state: {type:Schema.Types.ObjectId, ref:'master_state', set:deleteEmpty, autopopulate:{select:'name gstCode'}},
  country: {type:Schema.Types.ObjectId, ref:'master_country', set:deleteEmpty, autopopulate:{select:'name'}},
  bank: clientBankDetailSchema,
  package: {type: Number},
  salePoint: {type: Boolean},
  department: {type:Schema.Types.ObjectId, ref:'master_empDepartment', set:deleteEmpty, autopopulate:{select:'name'}},
  designation: {type:Schema.Types.ObjectId, ref:'master_empDesignation', set:deleteEmpty, autopopulate:{select:'name'}},
  files: employeeFileSchema,
  permission : permissionSchema,
  signupMail: {type: String},
  activateAccount: {type: Boolean},
  profile: employeeProfileSchema,
  authorID: {type:Schema.Types.ObjectId}, //if created by brandAdmin, then authorID is logged in user ID; if created as part of client creation, then authorID is client user ID
  active: {type: Boolean},
  createdBy: {type:Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
employeeSchema.plugin(autopopulate);

//ACCOUNTS SCHEMAS
var ledgerIndividualSchema = new Schema({
  name: {type: String},
  code: {type: String},
  gstin: {type: String},
  panID: {type: String},
  remark: {type: String},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  createdBy: {type: Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});

var ledgerSchema = new Schema({
  code: {type: String},
  ledgerGroup: {type: Schema.Types.ObjectId},
  credit: {type: Number},
  debit: {type: Number},
  bank: [{type: String}],
  branch: [{type: String}],
  refType: {type: String},
  refId: {type:Schema.Types.ObjectId, refPath:'refType', autopopulate:{select:'name panID gstin'}},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  createdBy: {type: Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
ledgerSchema.plugin(autopopulate);

var ledgerEntrySchema = new Schema({
  ledgerId: {type: Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  credit: {type: Number},
  debit: {type: Number},
  refIdType: {type: String},
  refId: {type: Schema.Types.ObjectId, refPath: 'refIdType', autopopulate: true},
  finYear: {type: Schema.Types.ObjectId, ref: 'master_finYear', autopopulate: true},
  refDate: {type: String},
  type: {type: String},
  authorID: {type: Schema.Types.ObjectId},
  pending: {type: Number},
  received: {type: Number},
  refJournal: [{type: Schema.Types.ObjectId, ref:'referenceJournal', autopopulate:true}],
  active: {type: Boolean}
},{versionKey: false});
ledgerEntrySchema.plugin(autopopulate);

var ledgerEntryCloneSchema = new Schema({
  ledgerId: {type: Schema.Types.ObjectId, ref:'ledger',  autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  credit: {type: Number},
  debit: {type: Number},
  refIdType: {type: String},
  refId: {type: Schema.Types.ObjectId, refPath: 'refIdType', autopopulate:{select:'-item -salePoint -type -mode -authorID -bank -paymentType -active -billDate -billno -code -createdBy -creationTime -creditDays -invenType -totalQuantity -refJournal -refNumber -ledgerFrom -ledgerTo -modifiedBy -modifiedDate -modifiedTime -IGST -CGST -SGST -grossValue'}},
  finYear: {type: Schema.Types.ObjectId, ref: 'master_finYear', autopopulate: true},
  refDate: {type: String},
  type: {type: String},
  authorID: {type: Schema.Types.ObjectId},
  pending: {type: Number},
  received: {type: Number},
  refJournal: [{type: Schema.Types.ObjectId, ref:'referenceJournalClone', autopopulate:{select:'-active -authorID -modifiedBy -modifiedDate -modifiedTime'}}],
  active: {type: Boolean}
},{versionKey: false});
ledgerEntryCloneSchema.plugin(autopopulate);

var receiptBankSchema = new Schema({
  bank: {type: String},
  payment: {type: String},
  branch: {type: String},
  transDate: {type: String},
  brsDate: {type: String},
  count: {type: Number},
  number: {type: String},
  active: {type: Boolean}
},{_id: false},{versionKey: true});

var paymentSchema = new Schema({
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  ledgerFrom: {type: Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  ledgerTo: {type: Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  type: {type: String},
  mode: {type: String},
  bank: receiptBankSchema,
  amount: {type: Number},
  refNumber: {type: String},
  refDate: {type: String},
  remark: {type: String},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
paymentSchema.plugin(autopopulate);

var receiptSchema = new Schema({
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  ledgerFrom: {type: Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  ledgerTo: {type: Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  type: {type: String},
  mode: {type: String},
  bank: receiptBankSchema,
  amount: {type: Number},
  refNumber: {type: String},
  refDate: {type: String},
  remark: {type: String},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
receiptSchema.plugin(autopopulate);

var journalSchema = new Schema({
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  ledgerFrom: {type: Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  ledgerTo: {type: Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  category: [{type:Schema.Types.ObjectId, ref:'master_productName', autopopulate:{select:'name'}}],
  amount: {type: Number},
  refDate: {type: String},
  remark: {type: String},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
journalSchema.plugin(autopopulate);

var contraSchema = new Schema({
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  ledgerFrom: {type: Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  ledgerTo: {type: Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  category: [{type:Schema.Types.ObjectId, ref:'master_productName', autopopulate:{select:'name'}}],
  amount: {type: Number},
  refDate: {type: String},
  remark: {type: String},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
contraSchema.plugin(autopopulate);

var debitSchema = new Schema({
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  type: {type: String},
  ledgerFrom: {type:Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  ledgerTo: {type:Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  amount: {type: Number},
  refDate: {type: String},
  remark: {type: String},
  item: {type:Schema.Types.ObjectId, ref:'master_productItem', autopopulate:{select:'itemName name itemCode brandName prodName IMEINumLen sellPrice costPrice'}},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
debitSchema.plugin(autopopulate);

var creditSchema = new Schema({
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  type: {type: String},
  ledgerFrom: {type:Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  ledgerTo: {type:Schema.Types.ObjectId, ref:'ledger', autopopulate:{select:'-authorID -modifiedBy -modifiedDate -modifiedTime -creationTime -creationDate -active -code'}},
  amount: {type: Number},
  refDate: {type: String},
  remark: {type: String},
  item: {type:Schema.Types.ObjectId, ref:'master_productItem', autopopulate:{select:'itemName name itemCode brandName prodName IMEINumLen sellPrice costPrice'}},
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
creditSchema.plugin(autopopulate);

var refJournalSchema = new Schema({
  id: {type: Schema.Types.ObjectId,ref: 'ledgerEntriesClone',autopopulate:{select:'-active -authorID -finYear'}},
  amount: {type: String}
},{_id:false}, {versionKey:false});
refJournalSchema.plugin(autopopulate);

var referenceJournalSchema = new Schema({
  invoiceNumber: {type: String},
  invoiceDate: {type: String},
  amount: {type: String},
  vouchers: [refJournalSchema],
  invoices: [refJournalSchema],
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
referenceJournalSchema.plugin(autopopulate);

var referenceJournalCloneSchema = new Schema({
  voucherNumber: {type: String},
  voucherDate: {type: String},
  amount: {type: String},
  vouchers: [{
    id: {type: Schema.Types.ObjectId,ref: 'ledgerEntriesClone',autopopulate:{select:'-active -authorID -finYear -refJournal -pending -received -credit -debit'}},
    amount: {type: String}
  }],
  invoices: [{
    id: {type: Schema.Types.ObjectId,ref: 'ledgerEntriesClone',autopopulate:{select:'-ledgerId -active -authorID -finYear -refJournal -pending -received -credit -debit'}},
    amount: {type: String}
  }],
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
referenceJournalCloneSchema.plugin(autopopulate);

var chequeBounceSchema = new Schema({
  remark: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{_id:false, versionKey:false});

var chequeSchema = new Schema({
  chequeno: {type: String},
  refId: {type: Schema.Types.ObjectId},
  bounce: [chequeBounceSchema],
  authorID: {type: Schema.Types.ObjectId}
},{versionKey: false});

/*USER SCHEMAS*/
var userSchema = new Schema({
  email: {type: String},
  password: {type: String},
  authorID: {type: Schema.Types.ObjectId}, //saving as array will return ther value in array.  This cannot be used in further querying
  parentID: {type: Schema.Types.ObjectId},
  refName: {type: String},
  refID: {type: Schema.Types.ObjectId,refPath: 'refName',autopopulate: true},
  userType: {type: String},
  createdBy: {type: Schema.Types.ObjectId},
  creationTime: {type: String},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean}
},{versionKey: false});
userSchema.plugin(autopopulate);

var userLogSchema = new Schema({
  userID: {type: Schema.Types.ObjectId,refPath: 'user',autopopulate: true},
  logType: {type: String},
  authorID: {type: Schema.Types.ObjectId},
  time: {type: String},
  date: {type: String}
},{versionKey: false});
userLogSchema.plugin(autopopulate);

//SETTING SCHEMAS
var companySettingSchema = new Schema({
  name: {type: String},
  email: {type: String},
  phone1: {type: Number},
  phone2: {type: String},
  state: {type: Schema.Types.ObjectId,ref: 'master_state',autopopulate:{select:'name gstCode'}},
  pincode: {type: Number},
  address: {type: String},
  cin: {type: String},
  gstin: {type: String},
  pan: {type: String},
  accountNumber: {type: String},
  accountName: {type: String},
  accountType: {type: String},
  ifsc: {type: String},
  micr: {type: String},
  bankName: {type: String},
  bankBranch: {type: String},
  bankaddress: {type: String},
  bankEmail: {type: String},
  logo: {type: String}
},{_id: false},{versionKey: false});
companySettingSchema.plugin(autopopulate);

var invoiceSettingSchema = new Schema({
  purchase: {type: String},
  sale: {type: String},
  purchaseDc: {type: String},
  saleDc: {type: String},
  saleReturn: {type: String},
  transfer: {type: String},
  refJournal: {type: String},
  journal: {type: String},
  contra: {type: String},
  payment: {type: String},
  receipt: {type: String},
  credit: {type: String},
  debit: {type: String},
  backLog: {type: Number}
},{_id: false},{versionKey: false});

var defaultSettingSchema = new Schema({
  // clientState: {type: Schema.Types.ObjectId,ref: 'master_state',autopopulate: true},
  // stockPoint: {type: Schema.Types.ObjectId,ref: 'master_salePoint',autopopulate: true}
  clientState: {type: Schema.Types.ObjectId},
  stockPoint: {type: Schema.Types.ObjectId}
},{_id: false},{versionKey: false});

var formatSettingSchema = new Schema({
  stockPoint: {type: String},
  serial: {type: String},
  journeyLabel1: {type: String},
  dealerLabel1: {type: String},
  dealerLabel2: {type: String}
},{_id: false},{versionKey: false});

var settingSchema = new Schema({
  company: companySettingSchema,
  invoice: invoiceSettingSchema,
  default: defaultSettingSchema,
  format: formatSettingSchema,
  active: {type: Boolean},
  authorID: {type: Schema.Types.ObjectId},
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String}
},{versionKey: false});
settingSchema.plugin(autopopulate);

/*MASTERMODEL*/
var masterStateModel = connObj.model('master_state',masterStateSchema,'master_state');
var masterRegionModel = connObj.model('master_region',masterRegionSchema,'master_region');
var masterZoneModel = connObj.model('master_zone',masterZoneSchema,'master_zone');
var masterDistrictModel = connObj.model('master_district',masterDistrictSchema,'master_district');
var masterAreaModel = connObj.model('master_area',masterAreaSchema,'master_area');
var masterCountryModel = connObj.model('master_country',masterCountrySchema,'master_country');
var masterCityModel = connObj.model('master_city',masterCitySchema,'master_city');
var masterUnitModel = connObj.model('master_unit',masterUnitSchema,'master_unit');
var masterSalePointModel = connObj.model('master_salePoint',masterSalePointSchema,'master_salePoint');
var masterClientDepartmentModel = connObj.model('master_clientDepartment', masterDepartmentSchema, 'master_clientDepartment');
var masterClientDesignationModel = connObj.model('master_clientDesignation', masterDesignationSchema, 'master_clientDesignation');
var masterDealerCategoryModel = connObj.model('master_dealerCategory', masterDealerCategorySchema, 'master_dealerCategory');
var masterProductTypeModel = connObj.model('master_productType', masterProductTypeSchema, 'master_productType');
var masterProductNameModel = connObj.model('master_productName', masterProductNameSchema, 'master_productName');
var masterProductBrandModel = connObj.model('master_productBrand', masterProductBrandSchema, 'master_productBrand');
var masterProductItemModel = connObj.model('master_productItem', masterProductItemSchema, 'master_productItem');
var masterProductAttributeModel = connObj.model('master_productAttribute', masterProductAttributeSchema, 'master_productAttribute');
var masterSupplierCategoryModel = connObj.model('master_supplierCategory', masterSupplierCategorySchema, 'master_supplierCategory');
var masterSupplierModel = connObj.model('master_supplier', masterSupplierSchema, 'master_supplier');
var masterEmpDepartmentModel = connObj.model('master_empDepartment', masterDepartmentSchema, 'master_empDepartment');
var masterEmpDesignationModel = connObj.model('master_empDesignation', masterDesignationSchema, 'master_empDesignation');
var masterEmpHierarchyModel = connObj.model('master_empHierarchy', masterHierarchySchema, 'master_empHierarchy');
var masterFinYearModel = connObj.model('master_finYear', masterFinancialYearSchema, 'master_finYear');
var masterLedgerGroupModel = connObj.model('master_ledger', masterLedgerSchema, 'master_ledger');
var masterVisitTypeModel = connObj.model('master_visitType', masterVisitTypeSchema, 'master_visitType');
/*INVENTORY*/
var inventoryModel = connObj.model('inventory',inventorySchema,'inventory');
var stockStatusModel = connObj.model('stockStatus',stockStatusSchema,'stockStatus');
var IMEImodel = connObj.model('imei',IMEIschema,'imei');
var salesReportModel = connObj.model('salesReport', salesReportSchema, 'salesReport');
/*CLIENT MODEL*/
var clientModel = connObj.model('client',clientSchema,'client');
var dealerModel = connObj.model('dealer',dealerSchema,'dealer');
/*HR MODEL*/
var employeeModel = connObj.model('employee',employeeSchema,'employee');
/*Expense Model*/
var expenseModel = connObj.model('expenses',expenseSchema,'expenses');
var journeyPlanModel = connObj.model('journeyPlan',journeyPlanSchema,'journeyPlan');
var hrEventModel = connObj.model('hrEvent', hrEventSchema,'hrEvent');
/*ACCOUNTS MODEL*/
var ledgerIndividualModel = connObj.model('ledgerIndividual',ledgerIndividualSchema,'ledgerIndividual');
var paymentModel = connObj.model('payment',paymentSchema,'payment');
var receiptModel = connObj.model('receipt',receiptSchema,'receipt');
var ledgerModel = connObj.model('ledger',ledgerSchema,'ledger');
var ledgerEntryModel = connObj.model('ledgerEntries',ledgerEntrySchema,'ledgerEntries');
var ledgerEntryCloneModel = connObj.model('ledgerEntriesClone', ledgerEntryCloneSchema, 'ledgerEntries');
var journalModel = connObj.model('journal',journalSchema,'journal');
var contraModel = connObj.model('contra',contraSchema,'contra');
var debitModel = connObj.model('debit',debitSchema,'debit');
var creditModel = connObj.model('credit',creditSchema,'credit');
var referenceJournalModel = connObj.model('referenceJournal', referenceJournalSchema, 'referenceJournal');
var referenceJournalCloneModel = connObj.model('referenceJournalClone', referenceJournalCloneSchema, 'referenceJournal');
var chequeModel = connObj.model('cheque', chequeSchema, 'cheque');
/*USER MODEL*/
var userModel = connObj.model('user',userSchema,'user');
var userLogModel = connObj.model('userLog',userLogSchema,'userLog');
/*SETTING MODEL*/
var settingModel = connObj.model('setting', settingSchema, 'setting');

/*MASTER*/
schemaService.masterStateModel = masterStateModel;
schemaService.masterRegionModel = masterRegionModel;
schemaService.masterZoneModel = masterZoneModel;
schemaService.masterDistrictModel = masterDistrictModel;
schemaService.masterAreaModel = masterAreaModel;
schemaService.masterCountryModel = masterCountryModel;
schemaService.masterCityModel = masterCityModel;
schemaService.masterUnitModel = masterUnitModel;
schemaService.masterSalePointModel = masterSalePointModel;
schemaService.masterClientDepartmentModel = masterClientDepartmentModel;
schemaService.masterClientDesignationModel = masterClientDesignationModel;
schemaService.masterDealerCategoryModel = masterDealerCategoryModel;
schemaService.masterProductTypeModel = masterProductTypeModel;
schemaService.masterProductNameModel = masterProductNameModel;
schemaService.masterProductBrandModel = masterProductBrandModel;
schemaService.masterProductItemModel = masterProductItemModel;
schemaService.masterProductAttributeModel = masterProductAttributeModel;
schemaService.masterSupplierCategoryModel = masterSupplierCategoryModel;
schemaService.masterSupplierModel = masterSupplierModel;
schemaService.masterEmpDepartmentModel = masterEmpDepartmentModel;
schemaService.masterEmpDesignationModel = masterEmpDesignationModel;
schemaService.masterEmpHierarchyModel = masterEmpHierarchyModel;
schemaService.masterFinYearModel = masterFinYearModel;
schemaService.masterLedgerGroupModel = masterLedgerGroupModel;
schemaService.masterVisitTypeModel = masterVisitTypeModel;
/*INVENTORY*/
schemaService.inventoryModel = inventoryModel;
schemaService.stockStatusModel = stockStatusModel;
schemaService.IMEImodel = IMEImodel;
schemaService.salesReportModel = salesReportModel;
/*CLIENT*/
schemaService.clientModel = clientModel;
schemaService.dealerModel = dealerModel;
/*HR*/
schemaService.employeeModel = employeeModel;
schemaService.expenseModel = expenseModel;
schemaService.journeyPlanModel = journeyPlanModel;
schemaService.hrEventModel = hrEventModel;
/*ACCOUNTS*/
schemaService.ledgerIndividualModel = ledgerIndividualModel;
schemaService.paymentModel = paymentModel;
schemaService.receiptModel = receiptModel;
schemaService.ledgerModel = ledgerModel;
schemaService.ledgerEntryModel = ledgerEntryModel;
schemaService.ledgerEntryCloneModel = ledgerEntryCloneModel;
schemaService.journalModel = journalModel;
schemaService.contraModel = contraModel;
schemaService.debitModel = debitModel;
schemaService.creditModel = creditModel;
schemaService.referenceJournalModel = referenceJournalModel;
schemaService.referenceJournalCloneModel = referenceJournalCloneModel;
schemaService.chequeModel = chequeModel;
/*USER*/
schemaService.userModel = userModel;
schemaService.userLogModel = userLogModel;
/*SETTING*/
schemaService.settingModel = settingModel;

module.exports = schemaService;