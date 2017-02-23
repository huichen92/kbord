//kbord controller
(function() {

	var app = angular.module('kapp', ['angular.filter']);

	app.controller('kbordCtrl', function($scope, $document, $http) {
			//获取当前时间
			$scope.getTimes = function() {
				var today = new Date();
				var data = today.getDate();
				var month = today.getMonth() + 1;
				var year = today.getFullYear();
				var day = today.getDay();
				if(today.getDay() == 0) day = " 星期日";
				if(today.getDay() == 1) day = " 星期一";
				if(today.getDay() == 2) day = " 星期二";
				if(today.getDay() == 3) day = " 星期三";
				if(today.getDay() == 4) day = " 星期四";
				if(today.getDay() == 5) day = " 星期五";
				if(today.getDay() == 6) day = " 星期六";
				month = month < 10 ? ('0' + month) : month;
				data = data < 10 ? ('0' + data) : data;
				document.getElementById('day').innerHTML = day;
				$scope.D = year + '-' + month + '-' + data;
				$scope.tday = data;
				$scope.tmon = month;
				$scope.selected = $scope.D;
				$scope.nowtime = today.getTime();
			}
			$scope.getTimes();
			$scope.timechange = false;

			//url
			var host = 'http://10.17.255.16';
			var host1 = 'http://10.17.255.44:3000';
			//var host = 'http://xgjk.fupy.com.cn';
			//			var host = 'http://10.17.255.22';
			//			var host = 'http://10.17.255.22:8088';

			//=========================================提醒更新版本======by wm=============================================
			$scope.version = 5;
			$scope.push = function() {
				$.get(host1 + '/api/kbord/Version_update',
					function(res, status) {
						$scope.xx = res;
						if($scope.compare == 0) {
							if($scope.xx != $scope.version) {
								//		console.log('mm')
								document.getElementById('update').style.display = 'block';
							}
						} else {
							if($scope.version == $scope.xx) {
								document.getElementById('detail').style.display = 'none';

								plus.nativeUI.toast('目前已经是最新版本了', {
									duration: 'long'
								});

							} else {
								document.getElementById('update').style.display = 'block';
								document.getElementById('detail').style.display = 'none';
							}

						}
					}).error(function(err) {
					console.log('err');
					console.log('版本更新功能服务器异常')
				})
			}
			$scope.update = function() {
				$scope.compare = 0;
				$scope.push();
			}

			$scope.canel = function() {
				document.getElementById('update').style.display = 'none';
			}

			$scope.openBrowser = function() {
					var url = "https://fegapp.fupy.com.cn/";
					plus.runtime.openURL(url);
					document.getElementById('update').style.display = 'none';
				}
				//定时检查                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
				//			var upTime = 1000 * 60*60*24;
				//			setInterval(function push() {
				//				$scope.compare=0;			
				//                 $scope.push();            
				//			}, upTime);
			$scope.showMore = function() {
				document.getElementById('detail').style.display = "block";
			}
			$scope.hide = function() {
				document.getElementById('detail').style.display = "none";
			}
			$scope.checkUpdate = function() {
					$scope.compare = 1;
					$scope.push();
				}
				//==============================================================================================================

			//POST API ================================================
			//====================by jk================================
			$scope.pdata = [];

			$scope.detaildata = [];
			$scope.dayuse1 = [];
			$scope.dayuse2 = [];

			//判断每月天数
			$scope.daylen = 0;
			$scope.daycount = function(m) {
				$scope.daylen = 0;
				switch(m) {
					case 1:
						$scope.daylen = 31;
						break;
					case 2:
						$scope.daylen = 29;
						break;
					case 3:
						$scope.daylen = 31;
						break;
					case 4:
						$scope.daylen = 30;
						break;
					case 5:
						$scope.daylen = 31;
						break;
					case 6:
						$scope.daylen = 30;
						break;
					case 7:
						$scope.daylen = 31;
						break;
					case 8:
						$scope.daylen = 31;
						break;
					case 9:
						$scope.daylen = 30;
						break;
					case 10:
						$scope.daylen = 31;
						break;
					case 11:
						$scope.daylen = 30;
						break;
					case 12:
						$scope.daylen = 31;
						break;
					default:
						break;
				}
			}
			$scope.change = false;
			//获取token
			$scope.getToken = function() {
				var userid = window.localStorage.getItem('userid');
				var pword = window.localStorage.getItem('password');
				$http.post(host + "/api/Account/Authenticate", {
					UsernameOrEmailAddress: userid,
					Password: pword
				}, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					window.localStorage.setItem('token', res.result);
					window.localStorage.setItem('time', $scope.nowtime);
				}).error(function(err, errstatus) {
					console.log(err);
				})
			}

			//判断token是否过期
			$scope.ifeffect = function() {
				var t = window.localStorage.getItem('time');
				var time = new Date();
				$scope.nowtime = time.getTime();
				var dvalue = ($scope.nowtime - t) / 3600000;
				if(dvalue > 160) {
					window.location.href = "login.html";
				} else {
					console.log('token值有效！')
				}
			}

			//判断是否过24:00点
			$scope.iftomorrow = function() {
				var time = new Date();
				var data = time.getDate();
				var d = window.localStorage.getItem('today');
				if(Number(data) != Number(d)) {
					window.localStorage.setItem('tip', 0);
					$scope.ref();
					$scope.compare = 0;
					$scope.push();

				}
			}

			//token有效期内是否有操作
			$scope.ifopt = function() {
				var t = window.localStorage.getItem('time');
				var time = new Date();
				$scope.nowtime = time.getTime();
				var dvalue = ($scope.nowtime - t) / 3600000;
				if(dvalue > 155) {
					$scope.getToken();
				} else {
					console.log('token无需更新！')
				}
			}

			//判断日期是否变更
			$scope.ifchange = function(year, month, day, i) {
				switch(i) {
					case 1:
						$scope.detail(4, 4, year, month, day, 1);
						break;
					case 2:
						$scope.detail(5, 4, year, month, day, 2);
						break;
					default:
						break;
				}

			}

			$scope.pushed = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			//推送
			$scope.pushs = function(time) {
				var t = window.localStorage.getItem('token');
				var userid = window.localStorage.getItem('userid');
				var tt = time.split('-');
				var yy = tt[0];
				var m = tt[1];
				var d = tt[2];
				var dd = '';
				//日期判断
				if(d == $scope.tday) {
					if(Number(d) != 1) {
						dd = d - 1;
					} else {
						switch(Number(m)) {
							case 1:
								yy = yy - 1;
								m = 12;
								dd = 31;
								break;
							case 2:
								m = 1;
								dd = 31;
								break;
							case 3:
								m = 2;
								if(yy % 4 == 0 && yy % 100 != 0) {
									dd = 29;
								} else {
									dd = 28;
								}
								break;
							case 4:
								m = 3;
								dd = 31;
								break;
							case 5:
								m = 4;
								dd = 30;
								break;
							case 6:
								m = 5;
								dd = 31;
								break;
							case 7:
								m = 6;
								dd = 30;
								break;
							case 8:
								m = 7;
								dd = 31;
								break;
							case 9:
								m = 8;
								dd = 31;
								break;
							case 10:
								m = 9;
								dd = 30;
								break;
							case 11:
								m = 10;
								dd = 31;
								break;
							case 12:
								m = 11;
								dd = 30;
								break;
							default:
								break;
						}
					}
				} else {
					dd = d;
				}

				//推送API
				$http.post(host + '/api/services/app/notificationMessage/GetNotificationsInformation', {
					//				$http.post('http://10.17.255.22/api/services/app/notificationMessage/GetNotificationsInformation', {
					UserName: userid
				}, {
					headers: {
						'Authorization': 'Bearer ' + t,
						//						'Authorization': 'Bearer jaT-PQ1xtiqnHDkRLWPRSYyMbs6frZoEGeprs5Wq4lzrTqBtxNLyX21L_XnrgqZpAnRjjvZnpav9oy1xZQM_Cj6fiXKOAHFdkVOrUF9i236KipnEsCXauPS_rWJz1T6MzjK9e2XhSH18XmJYhc273Rt7Snz0ZGxMtQC-7cnf_0fBqx75Ulb_6hFC4lwAZ2WEiSGxcQOWp_7G1A255zwclFH7_OHKG6j3oMin5J9fWHmoMP_UWW19okPRZgl8dxCdBOcaosmn4Moz2eOeNeXM4Iq2HGvhkl3OG6le_uDV9f3uFFiCLMj9i4lry1_jZeJQGqPjS7oKPmYwu86R9qMzpTrY2BrH61C-Cov4bhhGU3ztnb6RvZZ4BzFIAl8LUNEZYJBk7qTaFTRLouV9Ilk7ug',
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					if(res.result.count == 0) {
						console.log('无数据更新')
					} else {
						for(var i = 0; i < res.result.notificationTypeName.length; i++) {
							switch(res.result.notificationTypeName[i].notificationTypeName) {
								case '1_1': //EOG生产
									$scope.pushed[0] = 1;
									if($scope.selected == time) {
										$scope.getProduct(1, 1, 1, yy, m, dd, t, 0);
									}
									document.getElementById('crice1').style.display = "block";
									break;
								case '2_1': //EOG出货
									$scope.pushed[1] = 1;
									if($scope.selected == time) {
										$scope.getProduct(1, 2, 1, tt[0], tt[1], tt[2], t, 1);
									}
									document.getElementById('crice2').style.display = "block";
									break;
								case '3_1': //EOG库存
									$scope.pushed[2] = 1;
									if($scope.selected == time) {
										$scope.getProduct(1, 3, 1, yy, m, dd, t, 2);
										$scope.getstore(1, 3, yy, m, dd, t);
									}
									document.getElementById('crice3').style.display = "block";
									break;
								case '1_2': //ASU生产
									$scope.pushed[3] = 1;
									if($scope.selected == time) {
										$scope.getProduct(2, 1, 1, yy, m, dd, t, 3);
									}
									document.getElementById('crice4').style.display = "block";
									break;
								case '2_2': //ASU出货
									$scope.pushed[4] = 1;
									if($scope.selected == time) {
										$scope.getProduct(2, 2, 1, tt[0], tt[1], tt[2], t, 4);
									}
									document.getElementById('crice5').style.display = "block";
									break;
								case '3_2': //ASU库存
									$scope.pushed[5] = 1;
									if($scope.selected == time) {
										$scope.getProduct(2, 3, 1, yy, m, dd, t, 5);
										$scope.getstore(2, 3, yy, m, dd, t);
									}
									document.getElementById('crice6').style.display = "block";
									break;
								case '4_4': //原料
									$scope.pushed[6] = 1;
									if($scope.selected == time) {
										//原料耗用
										$scope.ifchange(yy, m, dd, 1);
									}
									document.getElementById('crice7').style.display = "block";
									break;
								case '4_5': //能源
									$scope.pushed[7] = 1;
									if($scope.selected == time) {
										//能源耗用
										$scope.ifchange(yy, m, dd, 2);
									}
									document.getElementById('crice8').style.display = "block";
									break;
								case '6_6': //价格
									$scope.pushed[8] = 1;
									if($scope.selected == time) {
										$scope.getprice('', '', '', '', t, time, 0, 0, 0, 0, 0);
									}
									document.getElementById('crice9').style.display = "block";
									break;
								default:
									break;
							}
						}
					}
				}).error(function(err, errstatus) {
					console.log(err);
				})
			};

			//定时检索是否推送
			$scope.check = function() {
				//				console.log($scope.change);
				if($scope.change) {
					console.log('暂停推送')
				} else {
					//判断是否有推送
					$scope.pushs($scope.D);
					$scope.pushid = setInterval(function() {
							$scope.pushs($scope.D);
						}, 1800000) //1800000
				}

			}

			//推送已读
			$scope.read = function(type, token, id) {

				var userid = window.localStorage.getItem('userid');

				$http.post(host + '/api/services/app/notificationMessage/SetNotificationsInformationAsRead', {
					//				$http.post('http://10.17.255.22/api/services/app/notificationMessage/SetNotificationsInformationAsRead', {
					UserName: userid,
					NotificationTypeName: type //'App.StockForEOG'
				}, {
					headers: {
						'Authorization': 'Bearer ' + token,
						//						'Authorization': 'Bearer jaT-PQ1xtiqnHDkRLWPRSYyMbs6frZoEGeprs5Wq4lzrTqBtxNLyX21L_XnrgqZpAnRjjvZnpav9oy1xZQM_Cj6fiXKOAHFdkVOrUF9i236KipnEsCXauPS_rWJz1T6MzjK9e2XhSH18XmJYhc273Rt7Snz0ZGxMtQC-7cnf_0fBqx75Ulb_6hFC4lwAZ2WEiSGxcQOWp_7G1A255zwclFH7_OHKG6j3oMin5J9fWHmoMP_UWW19okPRZgl8dxCdBOcaosmn4Moz2eOeNeXM4Iq2HGvhkl3OG6le_uDV9f3uFFiCLMj9i4lry1_jZeJQGqPjS7oKPmYwu86R9qMzpTrY2BrH61C-Cov4bhhGU3ztnb6RvZZ4BzFIAl8LUNEZYJBk7qTaFTRLouV9Ilk7ug',
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					if(res.result.state == 'Success') {
						$scope.pushed[id] = 0;
					}

				}).error(function(err, errstatus) {
					console.log(err);
				})
			};

			//获取日生产，出货，存货数据
			$scope.getProductday = function(pn, rt, rst, y, m, d, token, id) {
				$http.post(host + '/api/services/app/reportDaily/GetSummaryByProductName', {
					ProductName: pn,
					ReportType: rt,
					ReportSummaryType: rst,
					ReportYear: y,
					ReportMonth: m,
					ReportDate: d
				}, {
					headers: {
						'Authorization': 'Bearer ' + token,
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					$scope.pdata[id].daysum = res.result.summary_Value_Current;
					$scope.pdata[id].differ = res.result.differenceDataValue;

					switch(id) {
						case 0:
							if($scope.pdata[id].summary_Value_Surplus > 0) {
								$scope.mc0($scope.pdata[id].summary_Value_Current, $scope.pdata[id].summary_Value_Surplus, $scope.pdata[id].differ)
							} else {
								$scope.mc0($scope.pdata[id].summary_Value_Current, 0, $scope.pdata[id].differ)
							}
							break;
						case 1:
							if($scope.pdata[id].summary_Value_Surplus > 0) {
								$scope.mc1($scope.pdata[id].summary_Value_Current, $scope.pdata[id].summary_Value_Surplus, $scope.pdata[id].differ)
							} else {
								$scope.mc1($scope.pdata[id].summary_Value_Current, 0, $scope.pdata[id].differ)
							}
							break;
						case 2:
							//							$scope.mc2($scope.pdata[id].summary_Value_Current, $scope.pdata[id].differ)
							break;
						case 3:
							if($scope.pdata[id].summary_Value_Surplus > 0) {
								$scope.mc3($scope.pdata[id].summary_Value_Current, $scope.pdata[id].summary_Value_Surplus, $scope.pdata[id].differ)
							} else {
								$scope.mc3($scope.pdata[id].summary_Value_Current, 0, $scope.pdata[id].differ)
							}
							break;
						case 4:
							if($scope.pdata[id].summary_Value_Surplus > 0) {
								$scope.mc4($scope.pdata[id].summary_Value_Current, $scope.pdata[id].summary_Value_Surplus, $scope.pdata[id].differ)
							} else {
								$scope.mc4($scope.pdata[id].summary_Value_Current, 0, $scope.pdata[id].differ)
							}
							break;
						case 5:
							//							$scope.mc5($scope.pdata[id].summary_Value_Current, $scope.pdata[id].differ)
							break;
						default:
							alt('no data...');
					}
				}).error(function(err, errstatus) {
					console.log(err);
				})
			};

			//获取月生产，出货，存货数据
			$scope.getProduct = function(pn, rt, rst, y, m, d, token, id) {
				$http.post(host + '/api/services/app/reportDaily/GetSummaryByProductName', {
					ProductName: pn,
					ReportType: rt,
					ReportSummaryType: rst,
					ReportYear: y,
					ReportMonth: m,
					ReportDate: d
				}, {
					headers: {
						'Authorization': 'Bearer ' + token,
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					//					if(t == true) {
					$scope.pdata[id] = res.result;
					//					} else {
					//						$scope.pdata[id].daysum = res.result.summary_Value_Current;
					//						$scope.pdata[id].differ = res.result.differenceDataValue;
					switch(id) {
						case 0:
							//获取EOG日产量和
							$scope.getProductday(1, 1, 0, y, m, d, token, 0);
							//推送置为已读状态
							if($scope.pushed[0] == 1 && $scope.pdata[id].length != 0) {
								//								console.log('pushed0');
								$scope.read('1_1', token, id);
							}

							break;
						case 1:
							//获取EOG日出货量和
							$scope.getProductday(1, 2, 0, y, m, d, token, 1);
							//推送置为已读状态
							if($scope.pushed[1] == 1 && $scope.pdata[id].length != 0) {
								//								console.log('pushed1');
								$scope.read('2_1', token, id);
							}
							break;
						case 2:
							//获取EOG日库存
							$scope.getProductday(1, 3, 0, y, m, d, token, 2);
							//推送置为已读状态
							if($scope.pushed[2] == 1 && $scope.pdata[id].length != 0) {
								//								console.log('pushed2');
								$scope.read('3_1', token, id);
							}
							break;
						case 3:
							//获取ASU日产量和
							$scope.getProductday(2, 1, 0, y, m, d, token, 3);
							//推送置为已读状态
							if($scope.pushed[3] == 1 && $scope.pdata[id].length != 0) {
								//								console.log('pushed3');
								$scope.read('1_2', token, id);
							}
							break;
						case 4:
							//获取ASU日出货量和
							$scope.getProductday(2, 2, 0, y, m, d, token, 4);
							//推送置为已读状态
							if($scope.pushed[4] == 1 && $scope.pdata[id].length != 0) {
								//								console.log('pushed4');
								$scope.read('2_2', token, id);
							}
							break;
						case 5:
							//获取ASU日库存
							$scope.getProductday(2, 3, 0, y, m, d, token, 5);
							//推送置为已读状态
							if($scope.pushed[5] == 1 && $scope.pdata[id].length != 0) {
								//								console.log('pushed5');
								$scope.read('3_2', token, id);
							}
							break;
						default:
							alt('no data...');
					}
					//					}

				}).error(function(err, errstatus) {
					console.log(err);
				})
			};

			$scope.numname = []; //mark()初始化坐标系

			$scope.energy = [];
			$scope.energyper = [];
			$scope.energyday = [];
			$scope.detailall = function(dn, dt, dy, dm, d, use) {
				var t = window.localStorage.getItem('token');
				$http.post(host + "/api/services/app/reportDaily/GetReportdailyData_Extention", {
					ProductName: dn,
					ReportType: dt,
					ReportYear: dy,
					ReportMonth: dm,
					ReportDate: d
				}, {
					headers: {
						'Authorization': 'Bearer ' + t,
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					var res = res.result;
					for(var i = 0; i < use.length; i++) {
						var nn = use[i].materialTypeName.split('(');
						var n = nn[0]
						var id = 0;
						$scope.datemp = [];
						for(var j = 0; j < res.length; j++) {
							if(use[i].materialNumber == res[j].materialNumber) {
								$scope.datemp[id] = res[j].dataValue;
								if(i == 0) {
									$scope.energyday[id] = res[j].reportDate;
								}
								id++;
							}
						}
						$scope.energy[i] = {
							name: n,
							data: $scope.datemp
						};
					}
					$scope.peruseall(dy, dm, $scope.energy, d, use);

				}).error(function(err, errstatus) {
					console.log(err);
				})
			}

			//获取当日各物料生产，出货，库存
			$scope.sum = 0;
			$scope.total = 0;
			$scope.un = '';
			$scope.detail = function(dn, dt, dy, dm, d, use) {
				var dd = [];
				var dtemp = [];
				var dtemp2 = [];
				$scope.det = [];
				var t = window.localStorage.getItem('token');
				$http.post(host + "/api/services/app/reportDaily/GetReportdailyData", {
					ProductName: dn,
					ReportType: dt,
					ReportYear: dy,
					ReportMonth: dm,
					ReportDate: d
				}, {
					headers: {
						'Authorization': 'Bearer ' + t,
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					var dd = res.result;
					var ii = res.result.length - 1;
					if(dd[ii].materialTypeName == "TotalCount") {
						$scope.total = dd[ii].totalDataValue;
						$scope.un = dd[ii].unitName;
						dd.splice(ii, 1);
						//						$scope.detaildata = dd;
					}

					if(use != 0) {
						switch(use) {
							case 1:
								$scope.dayuse1 = dd;
								for(var i = 0; i < $scope.dayuse1.length; i++) {
									$scope.dayuse1[i].color = 111;
									var name = $scope.dayuse1[i].materialTypeName.split('日');
									$scope.dayuse1[i].materialTypeName = name[0];
								}
								//原料日单耗
								$scope.peruse(dy, dm, d, 0, '', 0);

								//推送置为已读状态
								if($scope.pushed[6] == 1 && $scope.dayuse1.length != 0) {
									//									console.log('pushed6');
									$scope.read('4_4', t, 6);
								}

								break;
							case 2:
								$scope.dayuse2 = dd;
								$scope.energy = [];
								$scope.energyper = [];

								for(var i = 0; i < $scope.dayuse2.length; i++) {
									$scope.dayuse2[i].color = 111;
									var name = $scope.dayuse2[i].materialTypeName.split('日');
									$scope.dayuse2[i].materialTypeName = name[0];
								}

								$scope.usesum = $scope.dayuse2[0].dataValue;
								$scope.dayuse2.splice(0, 1);

								//能源日单耗
								$scope.peruse(dy, dm, d, 0, '', 3);

								$scope.detailall(5, 4, dy, dm, d, $scope.dayuse2);

								//								$scope.daily1($scope.dayuse2[0].materialNumber, 4, dy, dm, 0, $scope.dayuse2[0].materialTypeName);
								//								$scope.daily2($scope.dayuse2[1].materialNumber, 4, dy, dm, 0, $scope.dayuse2[1].materialTypeName);
								//								$scope.daily3($scope.dayuse2[2].materialNumber, 4, dy, dm, 0, $scope.dayuse2[2].materialTypeName);
								//								console.dir($scope.energy)

								//推送置为已读状态
								if($scope.pushed[7] == 1 && $scope.dayuse2.length != 0) {
									//									console.log('pushed7');
									$scope.read('4_5', t, 7);
								}

								break;
							default:
								break;
						}
					} else {
						$scope.detaildata = dd;
						//						if(dt == 2){
						//							for(var j = 0; j < dd.length; j++) {
						//								if(Number(dd[j].dataValue) == 0){
						//									dd.splice(j, 1);
						//									j = -1;
						//								}
						//							}
						//						}

						if(dt == 3) {
							var x = 0;
							var y = 0;
							for(var i = 0; i < dd.length; i++) {
								if(dd[i].totalDataValueType == 0) {
									dtemp2[x] = dd[i];
									x = x + 1;
								} else {
									dtemp[y] = dd[i];
									y = y + 1;
								}
							}

							for(var j = 0; j < dtemp2.length; j++) {
								var kk = 0;
								dtemp2[j].level = [];
								for(var k = 0; k < dtemp.length; k++) {
									if(dtemp2[j].productNumber == dtemp[k].productNumber) {
										dtemp2[j].level[kk] = dtemp[k];
										kk = kk + 1;
									} //end if
								} //end for(K)
							} //end for(j)

							//							if (dif) {
							//								console.log('dif')
							////								for (var i=0;i<dtemp2.length;i++) {
							////									(function(i){
							////										$scope.daily(dtemp2[i].materialNumber, 3, dy, dm, 0, dtemp2[i].materialTypeName, dn);
							////									})(i);
							//////									$scope.storedata[i].push({'name':dtemp2[i].materialTypeName,'num':dtemp2[i].materialNumber,'data':[]});
							////								}
							//								
							//							} else{
							$scope.detaildata = dtemp2;
							//							}
						}

						for(var i = 0; i < $scope.detaildata.length; i++) {
							$scope.detaildata[i].color = 111;
							var name = $scope.detaildata[i].materialTypeName.split('日');
							$scope.detaildata[i].materialTypeName = name[0];
						}
					}

					switch($scope.id) {
						case 4:
							$scope.mark2(0, $scope.dayuse1[0].materialNumber, $scope.dayuse1[0].materialTypeName);
							break;
						case 5:
							$scope.mark2(0, $scope.dayuse2[0].materialNumber, $scope.dayuse2[0].materialTypeName);
							break;
						default:
							break;
					}

					if($scope.iid != undefined && $scope.detaildata.length != 0) {
						$scope.mark(0, $scope.detaildata[0].materialNumber, $scope.detaildata[0].materialTypeName);
					}

				}).error(function(err, errstatus) {
					console.log(err);
				})
			}

			//隐藏警报提示框
			window.localStorage.setItem('tip', 0);
			$scope.tips = function() {
					window.localStorage.setItem('tip', 1);
					document.getElementById('tip').style.display = 'none';
				}
				//

			//判断库存是否需要报警
			$scope.maxwarn = '';
			$scope.minwarn = '';
			$scope.maxshow = 0;
			$scope.minshow = 0;
			$scope.warning = function(dn, dt, dy, dm, d) {
					var t = window.localStorage.getItem('token');
					$http.post(host + "/api/services/app/reportDaily/GetReportdailyData", {
						ProductName: dn,
						ReportType: dt,
						ReportYear: dy,
						ReportMonth: dm,
						ReportDate: d
					}, {
						headers: {
							'Authorization': 'Bearer ' + t,
							'Content-Type': 'application/json'
						}
					}).success(function(res, status) {
						var warnres = res.result;
						switch(dn) {
							case 1:
								for(var i = 0; i < warnres.length; i++) {
									if(warnres[i].totalDataValueType == 0) {
										switch(warnres[i].materialNumber) {
											case "MT0070":
												if(Number(warnres[i].dataValue) > 15681.62) {
													$scope.maxwarn += "MEG(T-5001A):" + warnres[i].dataValue + 'T; ';
												} else if(Number(warnres[i].dataValue) < 1258.03) {
													$scope.minwarn += "MEG(T-5001A):" + warnres[i].dataValue + 'T; ';
												} else {
													console.log('未超出警戒值！')
												}
												break;
											case "MT0071":
												if(Number(warnres[i].dataValue) > 15710.62) {
													$scope.maxwarn += "MEG(T-5001B):" + warnres[i].dataValue + 'T; ';
												} else if(Number(warnres[i].dataValue) < 1290.48) {
													$scope.minwarn += "MEG(T-5001B):" + warnres[i].dataValue + 'T; ';
												} else {
													console.log('未超出警戒值！')
												}
												break;
											case "MT0072":
												if(Number(warnres[i].dataValue) > 2863.87) {
													$scope.maxwarn += "DEG(T5003):" + warnres[i].dataValue + 'T; ';
												} else if(Number(warnres[i].dataValue) < 147.49) {
													$scope.minwarn += "DEG(T5003):" + warnres[i].dataValue + 'T; ';
												} else {
													console.log('未超出警戒值！')
												}
												break;
											case "MT0073":
												if(Number(warnres[i].dataValue) > 139.51) {
													$scope.maxwarn += "TEG(T5005):" + warnres[i].dataValue + 'T; ';
												} else if(Number(warnres[i].dataValue) < 17.71) {
													$scope.minwarn += "TEG(T5005):" + warnres[i].dataValue + 'T; ';
												} else {
													console.log('未超出警戒值！')
												}
												break;
											default:
												break;
										}
									}
								}
								break;
							case 2:
								for(var j = 0; j < warnres.length; j++) {
									if(warnres[j].totalDataValueType == 0) {
										switch(warnres[j].materialNumber) {
											case "MT0045":
												if(Number(warnres[j].dataValue) > 1326.2) {
													$scope.maxwarn += "LOX:" + warnres[j].dataValue + 'T; ';
												} else if(Number(warnres[j].dataValue) < 209.4) {
													$scope.minwarn += "LOX:" + warnres[j].dataValue + 'T; ';
												} else {
													//												console.log('未超出警戒值！')
												}
												break;
											case "MT0047":
												if(Number(warnres[j].dataValue) > 1470.6) {
													$scope.maxwarn += "LIN:" + warnres[j].dataValue + 'T; ';
												} else if(Number(warnres[j].dataValue) < 232.2) {
													$scope.minwarn += "LIN:" + warnres[j].dataValue + 'T; ';
												} else {
													console.log('未超出警戒值！')
												}
												break;
											case "MT0049":
												if(Number(warnres[j].dataValue) > 826.5) {
													$scope.maxwarn += "LAR:" + warnres[j].dataValue + 'T; ';
												} else if(Number(warnres[j].dataValue) < 130.5) {
													$scope.minwarn += "LAR:" + warnres[j].dataValue + 'T; ';
												} else {
													console.log('未超出警戒值！')
												}
												break;
											default:
												break;
										}
									}
								}
								break;
							default:
								break;
						}
						if($scope.maxwarn.length != 0 || $scope.minwarn.length != 0) {
							document.getElementById('tip').style.display = 'block';
							if($scope.maxwarn.length != 0) {
								$scope.maxshow = 1;
							} else {
								$scope.maxshow = 0;
							}

							if($scope.minwarn.length != 0) {
								$scope.minshow = 1;
							} else {
								$scope.minshow = 0;
							}
						}
					}).error(function(err, errstatus) {
						console.log(err);
					})
				}
				//获取库存日累计数据
			$scope.storemax = {
				"MT0080": 5500,
				"MT0028": 3166,
				"MT0031": 538,
				"MT0034": 90,
				"MT0041": 90,
				"MT0070": 16000,
				"MT0071": 16000,
				"MT0072": 3000,
				"MT0073": 150,
				"MT0045": 1396,
				"MT0047": 1548,
				"MT0049": 870
			}
			$scope.warnmax = {
				"MT0080": 5225,
				"MT0028": 3007.7,
				"MT0031": 511.1,
				"MT0034": 85.5,
				"MT0041": 85.5,
				"MT0070": 15681.62, //MEG(T-5001A)库存
				"MT0071": 15710.62, //MEG(T-5001B)库存
				"MT0072": 2863.87, //DEG库存（T5003)
				"MT0073": 139.51, //TEG库存（T5005)
				"MT0045": 1326.2, //LOX总库存
				"MT0047": 1470.6, //LIN总库存
				"MT0049": 826.5 //LAR总库存
			}
			$scope.warnmin = {
				"MT0080": 825,
				"MT0028": 474.9,
				"MT0031": 80.7,
				"MT0034": 13.5,
				"MT0041": 13.5,
				"MT0070": 1258.03, //MEG(T-5001A)库存
				"MT0071": 1290.48, //MEG(T-5001B)库存
				"MT0072": 147.49, //DEG库存（T5003)
				"MT0073": 17.71, //TEG库存（T5005)
				"MT0045": 209.4, //LOX总库存
				"MT0047": 232.2, //LIN总库存
				"MT0049": 130.5 //LAR总库存
			}
			$scope.store = [];
			$scope.riqi = [];
			$scope.ming = [];
			$scope.storedata = [];
			$scope.store2 = [];
			$scope.riqi2 = [];
			$scope.ming2 = [];
			$scope.storedata2 = [];
			//			$scope.ydate = [];
			$scope.getstore = function(dn, dt, dy, dm, d, t) {
				//				var t = window.localStorage.getItem('token');
				$http.post(host + "/api/services/app/reportDaily/GetValueByProduct", {
					ProductName: dn,
					ReportType: dt,
					ReportYear: dy,
					ReportMonth: dm,
					ReportDate: d
				}, {
					headers: {
						'Authorization': 'Bearer ' + t,
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					var res = res.result;
					switch(dn) {
						case 1:
							$scope.store = [];
							$scope.riqi = [];
							$scope.ming = [];
							var mm = 0;
							for(var i = 0; i < res.length; i++) {
								res[i].sort(function(a, b) {
									return a.id - b.id;
								})
								$scope.storedata = [];
								for(var j = 0; j < res[i].length; j++) {

									$scope.storedata[j] = res[i][j].dataValue;
									//日期
									if(i == 0) {
										$scope.riqi[j] = res[i][j].reportDate;
									}
								}
								if(res[i][0].materialNumber == "MT0070" || res[i][0].materialNumber == "MT0071" || res[i][0].materialNumber == "MT0072" || res[i][0].materialNumber == "MT0073") {
									switch(res[i][0].materialNumber) {
										case "MT0070":
											//											var m = res[i][0].materialTypeName.split('(');
											//											console.dir(m)
											//											$scope.ming[i] = m[0] + '(A)';
											$scope.ming[i] = 'MEG(A)'
											$scope.store.push({
												'name': $scope.ming[i],
												'data': $scope.storedata
											});
											break;
										case "MT0071":
											//											var m = res[i][0].materialTypeName.split('(');
											//											$scope.ming[i] = m[0] + '(B)';
											$scope.ming[i] = 'MEG(B)';
											$scope.store.push({
												'name': $scope.ming[i],
												'data': $scope.storedata
											});
											break;
										case "MT0072":
											//											var m = res[i][0].materialTypeName.split('(');
											//											$scope.ming[i] = m[0];
											$scope.ming[i] = 'DEG';
											$scope.store.push({
												'name': $scope.ming[i],
												'data': $scope.storedata
											});
											break;
										case "MT0073":
											//											var m = res[i][0].materialTypeName.split('(');
											//											$scope.ming[i] = m[0];
											$scope.ming[i] = 'TEG';
											$scope.store.push({
												'name': $scope.ming[i],
												'data': $scope.storedata
											});
											break;
											//										case "MT0080":
											//											$scope.ming[i] = res[i][0].materialTypeName;
											//											$scope.store.push({'name':$scope.ming[i],'data':$scope.storedata});
											//											break;
										default:
											break;
									}
								} else {
									$scope.ming[i] = res[i][0].materialTypeName;
									$scope.store.push({
										'name': res[i][0].materialTypeName,
										'data': $scope.storedata
									})
								}
							}
							$scope.mc2($scope.ming, $scope.riqi, $scope.store);
							break;
						case 2:
							//							$scope.daycount(Number(dm));
							$scope.store2 = [];
							for(var i = 0; i < res.length; i++) {
								res[i].sort(function(a, b) {
									return a.id - b.id;
								})
								$scope.storedata2 = [];
								for(var j = 0; j < res[i].length; j++) {
									$scope.storedata2[j] = res[i][j].dataValue;
									//日期
									if(i == 0) {
										$scope.riqi2[j] = res[i][j].reportDate;
									}
								}
								$scope.ming2[i] = res[i][0].materialTypeName;
								$scope.store2.push({
									'name': res[i][0].materialTypeName,
									'data': $scope.storedata2
								})
							}
							$scope.mc5($scope.ming2, $scope.riqi2, $scope.store2);
							break;
						default:
							break;
					}
				}).error(function(err, errstatus) {
					console.log(err);
				})
			}

			//获取各物料当日生产数据
			$scope.ydate = [];
			$scope.daily = function(dn, dt, dy, dm, dd, eng) {
				$scope.dataday = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
				$scope.ydate = [];
				var t = window.localStorage.getItem('token');
				$http.post(host + "/api/services/app/reportDaily/GetDailyValueByMaterialName", {
					MaterialNumber: dn,
					ReportType: dt,
					ReportYear: dy,
					ReportMonth: dm,
					ReportDate: dd
				}, {
					headers: {
						'Authorization': 'Bearer ' + t,
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					$scope.daycount(res.result.items[0].reportMonth)
						//日期空数据补0
					var no1 = res.result.items[0].reportDate;
					if(eng) {
						if(no1 == 1) {
							for(var i = 0; i < res.result.items.length; i++) {
								$scope.ydate[i] = res.result.items[i].dataValue;
							}
						} else {
							var l = no1 - 1;
							var ll = l + res.result.items.length;
							for(var i = 0; i < l; i++) {
								$scope.ydate[i] = 0;
							}
							for(var j = l; j < ll; j++) {
								$scope.ydate[j] = res.result.items[j - l].dataValue;
							}
						}
					} else {
						if(no1 == 1) {
							if(res.result.items.length <= $scope.daylen) {
								var dl = res.result.items.length;
								for(var i = 0; i < res.result.items.length; i++) {
									$scope.ydate[i] = res.result.items[i].dataValue.toString();
								}
								for(var j = dl; j < $scope.daylen; j++) {
									$scope.ydate[j] = '0';
								}

							}
						} else {
							var l = no1 - 1;
							var ll = l + res.result.items.length;
							for(var i = 0; i < l; i++) {
								$scope.ydate[i] = '0';
							}
							for(var j = l; j < ll; j++) {
								$scope.ydate[j] = res.result.items[j - l].dataValue.toString();
							}
							for(var j = ll; j < $scope.daylen; j++) {
								$scope.ydate[j] = '0';
							}
						}

						$scope.dataday = $scope.ydate;
						$scope.init(dt, dn);
					}

				}).error(function(err, errstatus) {
					console.log(err);
				})
			}

			//获取各物料当月生产数据
			$scope.mdate = [];
			$scope.datamon = [];
			$scope.monthdate = function(dn, dt, dy, dm) {
				//				console.log('aaaa')
				$scope.mdate = [];
				$scope.datamon = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				var t = window.localStorage.getItem('token');
				$http.post(host + "/api/services/app/reportDaily/GetMonthlyValueByMaterialName", {
					MaterialName: dn,
					ReportType: dt,
					ReportYear: dy,
					ReportMonth: dm
				}, {
					headers: {
						'Authorization': 'Bearer ' + t,
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					//					console.log('bbbbb')
					//月份空数据补0
					var no2 = res.result[0].reportMonth;
					if(no2 == 1) {
						if(res.result.length <= 12) {
							var ml = res.result.length;
							for(var i = 0; i < res.result.length; i++) {
								$scope.mdate[i] = res.result[i].dataValue;
							}
							for(var j = ml; j < 12; j++) {
								$scope.mdate[j] = 0;
							}
						}

					} else {
						var l = no2 - 1;
						var ll = l + res.result.length;
						for(var i = 0; i < l; i++) {
							$scope.mdate[i] = 0;
						}
						for(var j = l; j < ll; j++) {
							$scope.mdate[j] = res.result[j - l].dataValue;
						}
						for(var k = ll; k < 12; k++) {
							$scope.mdate[k] = 0;
						}
					}
					$scope.datamon = $scope.mdate;
					$scope.init();
				}).error(function(err, errstatus) {
					console.log(err);
				})
			}

			//各物料日单耗

			$scope.peruseall = function(dy, dm, euse, d, use) {
				var t = window.localStorage.getItem('token');
				$http.post(host + "/api/services/app/reportDaily/GetMonthlyAllUnitExpendData", {
					ReportYear: dy,
					ReportMonth: dm,
					ReportDate: d,
					ReportSummaryType: 0,
					MaterialNumber: ''
				}, {
					headers: {
						'Authorization': 'Bearer ' + t,
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					for(var i = 0; i < use.length; i++) {
						var nn = use[i].materialTypeName.split('(');
						var n = nn[0] + '日单耗';
						$scope.patemp = [];
						for(var j = 0; j < res.result.length; j++) {
							if(use[i].materialNumber == res.result[j][0].materialNumber) {
								for(var k = 0; k < res.result[j].length; k++) {
									$scope.patemp[k] = res.result[j][k].expendData;
								}
							}
						}
						$scope.energyper[i] = {
							name: n,
							data: $scope.patemp
						};
					}
					$scope.mc8(euse, $scope.energyper);
				}).error(function(err, errstatus) {
					console.log(err);
				})
			}

			//日单耗/月单耗
			$scope.puse1 = [];
			$scope.puse2 = [];
			$scope.tempuse = []
			$scope.peruse = function(dy, dm, dd, rt, num, id) {
				var t = window.localStorage.getItem('token');
				$http.post(host + "/api/services/app/reportDaily/GetExpendData", {
					//				$http.post("http://10.17.255.22/api/services/app/reportDaily/GetExpendData", {
					ReportYear: dy,
					ReportMonth: dm,
					ReportDate: dd,
					ReportSummaryType: rt,
					MaterialNumber: num
				}, {
					headers: {
						'Authorization': 'Bearer ' + t,
						//						'Authorization': 'Bearer iEDtIckUqfq9z_Z4P4GNwzHg_RSr47mSzoXLw_4bMe8juHfFblKgppMwkmE5ClQ-iOKnRMyscFtkxwP9ehE-riOZcif1X8gba42P_fbjn-DWI-masKJrfMYvwzKOsZgSJwYJcvaULD1HK-IsmbyCSyUdzdHr-3mU_JCXBB1LNg-Y-STAp83jvlqgTFCdbOX2kK87jOKoNoHj9krkHnxHDm3nT1X_zgthRkrcGwn7fE2Pir56iXfxH9E2IJ21XAaYk-oBxo8VGeLHVh788zNeD8tAwiJlc3v3GhoPCZAJgzz8PzFUtYzRCHoRcluvC2D_bNfs5MR1tae_rST6p_dnYNX0d5YxgDkNV6X5fYGbooMev0lZAROepWfYVN9nuV5MMpYY-XYnff-hvlumSFvjMg',
						'Content-Type': 'application/json'
					}
				}).success(function(res, status) {
					$scope.tempuse = res.result.items;
					//					$scope.val = 1;
					switch(id) {
						case 0: //某一天原料各物料日单耗
							for(var i = 0; i < $scope.dayuse1.length; i++) {
								for(var j = 0; j < $scope.tempuse.length; j++) {
									if($scope.dayuse1[i].materialNumber == $scope.tempuse[j].materialNumber) {
										$scope.dayuse1[i].eData = $scope.tempuse[j].expendData.toFixed(3);
										switch($scope.tempuse[j].expendDataStatus) {
											case 1:
												$scope.dayuse1[i].src = 'images/1.png';
												break;
											case -1:
												$scope.dayuse1[i].src = 'images/2.jpg';
												break;
											case 0:
												$scope.dayuse1[i].src = 'images/0.jpg';
												break;
											default:
												break;
										}

									}
								} //end for2
							} //end for1
							break;

						case 1: //某一月某一种物料累积日单耗
							//日期空数据补0
							$scope.daycount(res.result.items[0].reportMonth)
								//日期空数据补0
							var no1 = res.result.items[0].reportDate;
							if(no1 == 1) {
								if(res.result.items.length <= $scope.daylen) {
									var dl = res.result.items.length;
									for(var i = 0; i < res.result.items.length; i++) {
										$scope.puse1[i] = res.result.items[i].expendData.toFixed(2);
									}
									for(var j = dl; j < $scope.daylen; j++) {
										$scope.puse1[j] = 0;
									}
								}
							} else {
								var l = no1 - 1;
								var ll = l + res.result.items.length;
								for(var i = 0; i < l; i++) {
									$scope.puse1[i] = 0;
								}
								for(var j = l; j < ll; j++) {
									$scope.puse1[j] = res.result.items[j - l].expendData.toFixed(2);
								}
								for(var k = ll; k < $scope.daylen; k++) {
									$scope.ydate[k] = 0;
								}
							}
							switch($scope.id) {
								case 4:
									$scope.dayp = $scope.puse1;
									//更新echarts模块数据
									$scope.init2();
									break;
								case 5:
									$scope.dayp2 = $scope.puse1;
									//更新echarts模块数据
									$scope.init2s();
									break;
								default:
									break;
							}

							break;

						case 2: //某年某一物料累积月单耗
							//月份空数据补0
							var no2 = res.result.items[0].reportMonth;
							if(no2 == 1) {
								if(res.result.items.length < 12) {
									var ml = res.result.items.length;
									for(var i = 0; i < res.result.items.length; i++) {
										$scope.puse2[i] = res.result.items[i].expendData.toFixed(2);
									}
									for(var j = ml; j < 12; j++) {
										$scope.puse2[j] = 0;
									}
								}
							} else {
								var l = no2 - 1;
								var ll = l + res.result.items.length;
								for(var i = 0; i < l; i++) {
									$scope.puse2[i] = 0;
								}
								for(var j = l; j < ll; j++) {
									$scope.puse2[j] = res.result.items[j - l].expendData.toFixed(2);
								}
								for(var j = ll; j < 12; j++) {
									$scope.puse2[j] = 0;
								}
							}
							switch($scope.id) {
								case 4:
									$scope.monp = $scope.puse2;
									//更新echarts模块数据
									$scope.init2();
									break;
								case 5:
									$scope.monp2 = $scope.puse2;
									//更新echarts模块数据
									$scope.init2s();
									break;
								default:
									break;
							}
							break;

						case 3: //某一天各能源日单耗
							for(var i = 0; i < $scope.dayuse2.length; i++) {
								for(var j = 0; j < $scope.tempuse.length; j++) {
									if($scope.dayuse2[i].materialNumber == $scope.tempuse[j].materialNumber) {
										$scope.dayuse2[i].eData = $scope.tempuse[j].expendData.toFixed(3);
										switch($scope.tempuse[j].expendDataStatus) {
											case 1:
												$scope.dayuse2[i].src = 'images/1.png';
												break;
											case -1:
												$scope.dayuse2[i].src = 'images/2.jpg';
												break;
											case 0:
												$scope.dayuse2[i].src = 'images/0.jpg';
												break;
											default:
												break;
										}

									}
								} //end for2
								if(i == $scope.dayuse2.length - 1) {
									$scope.dayuse2[i].src = 'images/0.jpg';
									//									$scope.mc8($scope.dayuse2);
								}
							} //end for1
							break;

						default:
							break;
					}
					//						
				}).error(function(err, errstatus) {
					console.log(err);
				})
			}

			//获取各物料价格
			$scope.cID = '';
			$scope.editc = 0;
			$scope.trans = true;
			$scope.mtrans = false;
			$scope.pID = '';
			$scope.editp = 0;
			$scope.mNo = '';
			$scope.aNo = '';
			$scope.price = [];
			$scope.areaprice = [];
			$scope.apdeatil = [];
			$scope.getprice = function(c, p, mn, an, t, time, y, m, d, id, dc) {
					$http.post(host + "/api/services/app/getPricePlan/GetPlanPriceValue", {
							//					$http.post("http://10.17.255.22/api/services/app/getPricePlan/GetPlanPriceValue", {
							ClassID: c,
							PricetypeID: p,
							MarketNo: mn,
							AreaNo: an,
							Date: time,
							year: y,
							month: m,
							day: d,
							dataCount: dc
						}, {
							headers: {
								'Authorization': 'bearer ' + t,
								//								'Authorization': 'bearer iEDtIckUqfq9z_Z4P4GNwzHg_RSr47mSzoXLw_4bMe8juHfFblKgppMwkmE5ClQ-iOKnRMyscFtkxwP9ehE-riOZcif1X8gba42P_fbjn-DWI-masKJrfMYvwzKOsZgSJwYJcvaULD1HK-IsmbyCSyUdzdHr-3mU_JCXBB1LNg-Y-STAp83jvlqgTFCdbOX2kK87jOKoNoHj9krkHnxHDm3nT1X_zgthRkrcGwn7fE2Pir56iXfxH9E2IJ21XAaYk-oBxo8VGeLHVh788zNeD8tAwiJlc3v3GhoPCZAJgzz8PzFUtYzRCHoRcluvC2D_bNfs5MR1tae_rST6p_dnYNX0d5YxgDkNV6X5fYGbooMev0lZAROepWfYVN9nuV5MMpYY-XYnff-hvlumSFvjMg',
								'Content-Type': 'application/json'
							}
						}).success(function(res, status) {
							for(var i = 0; i < res.result.length; i++) {
								var time = res.result[i].date.split('T');
								res.result[i].date = time[0];
							}

							switch(id) {
								case 0:
									$scope.price = res.result;
									//推送置为已读状态
									if($scope.pushed[8] == 1 && $scope.price.length != 0) {
										//										console.log('pushed8');
										$scope.read('6_6', t, 8);
									}
									break;
								case 1:
									$scope.areaprice = res.result;
									break;
								case 2:
									$scope.apdeatil = res.result;
									switch(dc) {
										case 30:
											for(var i = 0; i < $scope.apdeatil.length; i++) {
												$scope.week[i] = $scope.apdeatil[i].date;
												$scope.weekdata[i] = $scope.apdeatil[i].marketPrice;
												$scope.init4($scope.week, $scope.weekdata, 1);
											}
											break;
										case 90:
											for(var i = 0; i < $scope.apdeatil.length; i++) {
												$scope.weekj[i] = $scope.apdeatil[i].date;
												$scope.weekdataj[i] = $scope.apdeatil[i].marketPrice;
												//												$scope.init4($scope.week,$scope.weekdata,1);
											}
											break;
										case 180:
											for(var i = 0; i < $scope.apdeatil.length; i++) {
												$scope.weekb[i] = $scope.apdeatil[i].date;
												$scope.weekdatab[i] = $scope.apdeatil[i].marketPrice;
												//												$scope.init4($scope.week,$scope.weekdata,1);
											}
											break;
										case 360:
											for(var i = 0; i < $scope.apdeatil.length; i++) {
												$scope.weekn[i] = $scope.apdeatil[i].date;
												$scope.weekdatan[i] = $scope.apdeatil[i].marketPrice;
												//												$scope.init4($scope.week,$scope.weekdata,1);
											}
											break;
										default:
											break;
									}

								case 3:
									$scope.apdeatil2 = res.result;

									switch(dc) {
										case 30:
											for(var i = 0; i < $scope.apdeatil2.length; i++) {
												$scope.week2[i] = $scope.apdeatil2[i].date;
												$scope.weekdata2[i] = $scope.apdeatil2[i].marketPrice;
												$scope.init4($scope.week2, $scope.weekdata2, 2);
											}
											break;
										case 90:
											for(var i = 0; i < $scope.apdeatil2.length; i++) {
												$scope.week2j[i] = $scope.apdeatil2[i].date;
												$scope.weekdata2j[i] = $scope.apdeatil2[i].marketPrice;
												//												$scope.init4($scope.week2,$scope.weekdata2,2);
											}
											break;
										case 180:
											for(var i = 0; i < $scope.apdeatil2.length; i++) {
												$scope.week2b[i] = $scope.apdeatil2[i].date;
												$scope.weekdata2b[i] = $scope.apdeatil2[i].marketPrice;
												//												$scope.init4($scope.week2,$scope.weekdata2,2);
											}
											break;
										case 360:
											for(var i = 0; i < $scope.apdeatil2.length; i++) {
												$scope.week2n[i] = $scope.apdeatil2[i].date;
												$scope.weekdata2n[i] = $scope.apdeatil2[i].marketPrice;
												//												$scope.init4($scope.week2,$scope.weekdata2,2);
											}
											break;
										default:
											break;
									}

									break;
								case 4:
									if(res.result.length == 0) {
										alt('未找到该物料市场价');
									} else {
										$scope.marketprc = res.result;
									}
									break;
								case 5:
									$scope.mpdeatil = res.result;

									switch(dc) {
										case 30:
											for(var i = 0; i < $scope.mpdeatil.length; i++) {
												$scope.week3[i] = $scope.mpdeatil[i].date;
												$scope.weekdata3[i] = $scope.mpdeatil[i].marketPrice;
												$scope.init4($scope.week3, $scope.weekdata3, 3);
											}
											break;
										case 90:
											for(var i = 0; i < $scope.mpdeatil.length; i++) {
												$scope.week3j[i] = $scope.mpdeatil[i].date;
												$scope.weekdata3j[i] = $scope.mpdeatil[i].marketPrice;
												//												$scope.init4($scope.week3,$scope.weekdata3,3);
											}
											break;
										case 180:
											for(var i = 0; i < $scope.mpdeatil.length; i++) {
												$scope.week3b[i] = $scope.mpdeatil[i].date;
												$scope.weekdata3b[i] = $scope.mpdeatil[i].marketPrice;
												//												$scope.init4($scope.week3,$scope.weekdata3,3);
											}
											break;
										case 360:
											for(var i = 0; i < $scope.mpdeatil.length; i++) {
												$scope.week3n[i] = $scope.mpdeatil[i].date;
												$scope.weekdata3n[i] = $scope.mpdeatil[i].marketPrice;
												//												$scope.init4($scope.week3,$scope.weekdata3,3);
											}
											break;
										default:
											break;
									}

									break;
								case 6:
									for(var j = 0; j < $scope.data.length; j++) {
										for(var k = 0; k < res.result.length; k++) {
											if($scope.data[j].value == res.result[k].areaNo) {
												$scope.data[j].price = res.result[k].marketPrice + res.result[k].units;
												$scope.data[j].size = res.result[k].marketPrice;
											}
										}
									}
									$scope.init3();
									break;
								case 7:

									for(var j = 0; j < $scope.mapData.length; j++) {
										for(var k = 0; k < res.result.length; k++) {
											if($scope.mapData[j].value == res.result[k].marketNo) {
												$scope.mapData[j].price = res.result[k].marketPrice;
												$scope.mapData[j].nut = res.result[k].units
											}
										}
										//按价格排序并设置图标大小
										if(j == $scope.mapData.length - 1) {
											$scope.mapData.sort(function(a, b) {
												return a.price - b.price;
											});
											var s = 20;
											for(var i = 0; i < $scope.mapData.length; i++) {
												if(i == 0) {
													$scope.mapData[i].size = s;
												} else {
													if($scope.mapData[i].price == $scope.mapData[i - 1].price) {
														$scope.mapData[i].size = s;
													} else {
														s = s + 5;
														$scope.mapData[i].size = s;
													}
												}
											}
										}
									}
									$scope.init3();
									break;
								default:
									break;
							}

						}).error(function(err, errstatus) {
							console.log(err);
						}) //end price
				}
				//			$scope.getprice(1, $scope.selected, 0, 0, 0);
				//获取价格明细
			$scope.pdetail = function() {
				var t = window.localStorage.getItem('token');
				var time = $scope.selected.split('-');
				if($scope.editc == 0 && $scope.editp == 0) {
					alt('请选择物料和价格种类');
				} else {
					switch($scope.editc) {
						case 0:
							alt('请选择物料')
							break;
						case 1:
							if($scope.editp == 0) {
								alt('请选择价格种类')
							} else {
								$scope.getprice($scope.cID, $scope.pID, mn, an, t, '', time[0], time[1], time[2], id, 0)
							}
							break;
						default:
							break;
					}
				}
			}

			//初始化数据
			$scope.initall = function(yy, m, d, ifwarn) {
					var chu = $scope.selected.split('-');
					var time = yy + '-' + m + '-' + d;
					var dd;
					if(d == $scope.tday) {
						if(Number(d) != 1) {
							dd = d - 1;
						} else {
							switch(Number(m)) {
								case 1:
									yy = yy - 1;
									m = 12;
									dd = 31;
									break;
								case 2:
									m = 1;
									dd = 31;
									break;
								case 3:
									m = 2;
									if(yy % 4 == 0 && yy % 100 != 0) {
										dd = 29;
									} else {
										dd = 28;
									}
									break;
								case 4:
									m = 3;
									dd = 31;
									break;
								case 5:
									m = 4;
									dd = 30;
									break;
								case 6:
									m = 5;
									dd = 31;
									break;
								case 7:
									m = 6;
									dd = 30;
									break;
								case 8:
									m = 7;
									dd = 31;
									break;
								case 9:
									m = 8;
									dd = 31;
									break;
								case 10:
									m = 9;
									dd = 30;
									break;
								case 11:
									m = 10;
									dd = 31;
									break;
								case 12:
									m = 11;
									dd = 30;
									break;
								default:
									break;
							}
						}
					} else {
						dd = d;
					}

					var t = window.localStorage.getItem('token');
					$scope.getProduct(1, 1, 1, yy, m, dd, t, 0);
					$scope.getProduct(1, 2, 1, chu[0], chu[1], chu[2], t, 1);
					$scope.getProduct(1, 3, 1, yy, m, dd, t, 2);
					$scope.getProduct(2, 1, 1, yy, m, dd, t, 3);
					$scope.getProduct(2, 2, 1, chu[0], chu[1], chu[2], t, 4);
					$scope.getProduct(2, 3, 1, yy, m, dd, t, 5);
					$scope.getstore(1, 3, yy, m, dd, t);
					$scope.getstore(2, 3, yy, m, dd, t);
					$scope.getprice('', '', '', '', t, time, 0, 0, 0, 0, 0);
					//原料耗用
					$scope.ifchange(yy, m, dd, 1);
					//能源耗用
					$scope.ifchange(yy, m, dd, 2);

					var tipshow = window.localStorage.getItem('tip');
					if(tipshow != 0) {
						console.log('不报警！')
					} else {
						if(ifwarn == true) {
							console.log('无需重新检查警戒值')
						} else {
							$scope.warning(1, 3, yy, m, dd);
							$scope.warning(2, 3, yy, m, dd);
						}

					}
				} //end initall

			$scope.ry = '';
			$scope.rm = '';
			$scope.rd = '';
			$scope.start = function(dd) {
				$scope.maxwarn = '';
				$scope.minwarn = '';
				var d = dd.split('-');
				$scope.ry = d[0];
				$scope.rm = d[1];
				$scope.rd = d[2];
				//初始化数据
				$scope.initall($scope.ry, $scope.rm, $scope.rd);

				setInterval(function() {
					//判断token是否过期
					$scope.ifeffect();
				}, 1800000);
				//判断是否过24:00点
				setInterval(function() {
					$scope.iftomorrow();
				}, 40000);
				//检查是否有推送
				$scope.check();
			}
			$scope.start($scope.D); //
			//检查是否有更新
			$scope.update();

			//			setInterval(function(){
			//				$scope.pushs($scope.D);
			//			},30000);

			//end 初始化数据

			//登出
			$scope.logout = function() {
				$.messager.confirm('提示', '确认退出当前账号？', function(r) {
					if(r) {
						window.localStorage.removeItem('token');
						window.location.href = "login.html";
					}
				});

				//				var l = confirm('确认退出当前账号？');
				//				if(l == true){
				//					window.localStorage.removeItem('token');
				//					window.location.href = "login.html";
				//				}else{
				//					console.log('取消退出')
				//				}
			}

			//刷新
			$scope.ref = function() {
				$scope.getTimes();
				$scope.start($scope.D);
				$scope.ifopt();
				window.localStorage.setItem('today', $scope.tday);
			}

			//日期变更

			$scope.ifdone = 0;
			$scope.n = function(n) {
				$scope.timechange = true;
				var dd = 0;
				var t = n.split('-');

				$scope.ry = t[0];
				$scope.rm = t[1];
				$scope.rd = t[2];
				if($scope.rd == $scope.tday) {
					if(Number($scope.rd) != 1) {
						dd = $scope.rd - 1;
					} else {
						switch(Number($scope.rm)) {
							case 1:
								$scope.ry = $scope.ry - 1;
								$scope.rm = 12;
								dd = 31;
								break;
							case 2:
								$scope.rm = 1;
								dd = 31;
								break;
							case 3:
								$scope.rm = 2;
								if($scope.ry % 4 == 0 && $scope.ry % 100 != 0) {
									dd = 29;
								} else {
									dd = 28;
								}
								break;
							case 4:
								$scope.rm = 3;
								dd = 31;
								break;
							case 5:
								$scope.rm = 4;
								dd = 30;
								break;
							case 6:
								$scope.rm = 5;
								dd = 31;
								break;
							case 7:
								$scope.rm = 6;
								dd = 30;
								break;
							case 8:
								$scope.rm = 7;
								dd = 31;
								break;
							case 9:
								$scope.rm = 8;
								dd = 31;
								break;
							case 10:
								$scope.rm = 9;
								dd = 30;
								break;
							case 11:
								$scope.rm = 10;
								dd = 31;
								break;
							case 12:
								$scope.rm = 11;
								dd = 30;
								break;
							default:
								break;
						}
					}
				} else {
					dd = $scope.rd;
				}

				if($scope.change) {
					$scope.dataday = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
					$scope.datamon = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
					$scope.dayp = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
					$scope.monp = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
					$scope.dayp2 = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
					$scope.monp2 = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
					$scope.init();
					$scope.init2();
					$scope.init2s();
					switch($scope.id) {
						case 1:
							if($scope.iid == 1) {
								$scope.detail(1, 1, $scope.ry, $scope.rm, dd, 0);
							} else {
								$scope.detail(2, 1, $scope.ry, $scope.rm, dd, 0);
							}
							break;
						case 2:
							if($scope.iid == 2) {
								$scope.detail(1, 2, t[0], t[1], t[2], 0);
							} else {
								$scope.detail(2, 2, t[0], t[1], t[2], 0);
							}
							break;
						case 3:
							if($scope.iid == 5) {
								$scope.detail(1, 3, $scope.ry, $scope.rm, dd, 0);
							} else {
								$scope.detail(2, 3, $scope.ry, $scope.rm, dd, 0);
							}
							break;
						case 4:
							//原料耗用
							$scope.ifchange($scope.ry, $scope.rm, dd, 1);
							//日单耗
							//							$scope.peruse($scope.ry, $scope.rm, dd, 0, '', 0);
							break;
						case 5:
							//能源耗用
							$scope.ifchange($scope.ry, $scope.rm, dd, 2);
							break;
						default:
							break;
					}

					switch($scope.pricetype) {
						case 1:
							//获取国际价
							switch($scope.cID) {
								case '200':
									$scope.table10();
									break;
								case '317':
									$scope.table11();
									break;
								case '332':
									$scope.table12();
									break;
								case '461':
									$scope.table13();
									break;
								case '340':
									$scope.table14();
									break;
								case '375':
									$scope.table15();
									break;
								default:
									break;
							}
							break;
						case 2:
							//获取出厂价
							$scope.ifdone = 0;

							if($scope.iflist == 1) {
								var toke = window.localStorage.getItem('token');
								$scope.getprice($scope.cID, 24, 0, $scope.ano, toke, n, 0, 0, 0, 1, 0);
								$scope.ifdone = 1;
							} else {
								switch($scope.cID) {
									case '200':
										$scope.table10();
										break;
									case '317':
										$scope.table11();
										break;
									case '332':
										$scope.table12();
										break;
									case '461':
										$scope.table13();
										break;
									case '340':
										$scope.table14();
										break;
									case '375':
										$scope.table15();
										break;
									default:
										break;
								}
							}

							break;
						case 3:
							//获取市场价
							var toke = window.localStorage.getItem('token');
							$scope.getprice($scope.cID, 25, 0, 0, toke, n, 0, 0, 0, 4, 0);
							break;
						default:
							break;
					}

					console.log('change')
				} else {
					$scope.initall($scope.ry, $scope.rm, $scope.rd, true);

				}

			}

			//POST API END ============================================

			$scope.titday = $scope.btnday;
			$scope.titmonth = $scope.btnmon;
			$scope.perday = '日单耗';
			$scope.permon = '月单耗';
			$scope.smax = '0';
			$scope.wmax = '0';
			$scope.wmin = '0';
			$scope.mark = function(x, y, z) {
				var tt = $scope.selected.split('-');
				$scope.ry = tt[0];
				$scope.rm = tt[1];
				$scope.rd = tt[2];
				if($scope.rd == $scope.tday) {
					if(Number($scope.rd) != 1) {
						dd = $scope.rd - 1;
					} else {
						switch(Number($scope.rm)) {
							case 1:
								$scope.ry = $scope.ry - 1;
								$scope.rm = 12;
								dd = 31;
								break;
							case 2:
								$scope.rm = 1;
								dd = 31;
								break;
							case 3:
								$scope.rm = 2;
								if($scope.ry % 4 == 0 && $scope.ry % 100 != 0) {
									dd = 29;
								} else {
									dd = 28;
								}
								break;
							case 4:
								$scope.rm = 3;
								dd = 31;
								break;
							case 5:
								$scope.rm = 4;
								dd = 30;
								break;
							case 6:
								$scope.rm = 5;
								dd = 31;
								break;
							case 7:
								$scope.rm = 6;
								dd = 30;
								break;
							case 8:
								$scope.rm = 7;
								dd = 31;
								break;
							case 9:
								$scope.rm = 8;
								dd = 31;
								break;
							case 10:
								$scope.rm = 9;
								dd = 30;
								break;
							case 11:
								$scope.rm = 10;
								dd = 31;
								break;
							case 12:
								$scope.rm = 11;
								dd = 30;
								break;
							default:
								break;
						}
					}
				} else {
					dd = $scope.rd;
				}

				$scope.titday = z + $scope.btnday;
				$scope.titmonth = z + $scope.btnmon;
				//API
				//获取对应日累积量
				if($scope.id == 2) {
					$scope.daily(y, $scope.id, tt[0], tt[1], 0);
				} else {
					$scope.daily(y, $scope.id, $scope.ry, $scope.rm, 0);
				}

				//获取对应月累计量
				if($scope.id != 3) {
					$scope.monthdate(y, $scope.id, $scope.ry, 0);
				}

				//判断是否选中
				//				if(x){
				for(var i = 0; i < $scope.detaildata.length; i++) {
					if(i == x) {
						$scope.detaildata[i].color = x;
					} else {
						$scope.detaildata[i].color = 111;
					}
				} //end for
				//				}//end if
				//				$scope.remove();
				$('#MT0080').removeClass('activator');
			}

			$scope.mark2 = function(x, y, z) {
				var tt = $scope.selected.split('-');
				$scope.ry = tt[0];
				$scope.rm = tt[1];
				$scope.rd = tt[2];
				if($scope.rd == $scope.tday) {
					if(Number($scope.rd) != 1) {
						dd = $scope.rd - 1;
					} else {
						switch(Number($scope.rm)) {
							case 1:
								$scope.ry = $scope.ry - 1;
								$scope.rm = 12;
								dd = 31;
								break;
							case 2:
								$scope.rm = 1;
								dd = 31;
								break;
							case 3:
								$scope.rm = 2;
								if($scope.ry % 4 == 0 && $scope.ry % 100 != 0) {
									dd = 29;
								} else {
									dd = 28;
								}
								break;
							case 4:
								$scope.rm = 3;
								dd = 31;
								break;
							case 5:
								$scope.rm = 4;
								dd = 30;
								break;
							case 6:
								$scope.rm = 5;
								dd = 31;
								break;
							case 7:
								$scope.rm = 6;
								dd = 30;
								break;
							case 8:
								$scope.rm = 7;
								dd = 31;
								break;
							case 9:
								$scope.rm = 8;
								dd = 31;
								break;
							case 10:
								$scope.rm = 9;
								dd = 30;
								break;
							case 11:
								$scope.rm = 10;
								dd = 31;
								break;
							case 12:
								$scope.rm = 11;
								dd = 30;
								break;
							default:
								break;
						}
					}
				} else {
					dd = $scope.rd;
				}

				$scope.titday = z + $scope.btnday;
				$scope.titmonth = z + $scope.btnmon;
				$scope.titday1 = z + $scope.perday;
				$scope.titmonth1 = z + $scope.permon;
				$scope.titday2 = z + $scope.perday;
				$scope.titmonth2 = z + $scope.permon;
				//判断是否选中
				//				if(w == true) {
				//					//获取日单耗累积
				//					$scope.peruse($scope.ry, $scope.rm, 0, 0, y, 1);
				//					//获取月单耗累积
				//					$scope.peruse($scope.ry, 0, 0, 1, y, 2);
				//					//获取日累积
				//					$scope.daily(y, 4, $scope.ry, $scope.rm, 0);
				//					//获取月累积
				//					$scope.monthdate(y, 4, $scope.ry, 0);
				//
				//					switch ($scope.id){
				//						case 4:
				//							for(var i = 0; i < $scope.dayuse1.length; i++) {
				//								if(i == x) {
				//									$scope.dayuse1[i].color = x;
				//								} else {
				//									$scope.dayuse1[i].color = 111;
				//								}
				//							}
				//							break;
				//							
				//						case 5:
				//							for(var i = 0; i < $scope.dayuse2.length; i++) {
				//								if(i == x) {
				//									$scope.dayuse2[i].color = x;
				//								} else {
				//									$scope.dayuse2[i].color = 111;
				//								}
				//							}
				//							break;
				//							
				//						default:
				//							break;
				//					}
				//					
				//				} else {
				////					//获取日累积
				////					$scope.daily(y, 4, $scope.ry, $scope.rm, 0);
				////					//获取月累积
				////					$scope.monthdate(y, 4, $scope.ry, 0);
				//					console.log('mark2 not true')
				//
				//					
				//				}
				if(y == 'MT0069') {
					for(var i = 0; i < $scope.dayuse2.length; i++) {
						if(i == x) {
							$scope.dayuse2[i].color = x;
						} else {
							$scope.dayuse2[i].color = 111;
						}
					}
					//获取日累积
					$scope.daily(y, 4, $scope.ry, $scope.rm, 0);
					//获取月累积
					$scope.monthdate(y, 4, $scope.ry, 0);
					//日单耗，月单耗清零
					$scope.dayp2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					$scope.monp2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					$scope.init2s();
				} else {
					//获取日单耗累积
					$scope.peruse($scope.ry, $scope.rm, 0, 0, y, 1);
					//获取月单耗累积
					$scope.peruse($scope.ry, 0, 0, 1, y, 2);
					//获取日累积
					$scope.daily(y, 4, $scope.ry, $scope.rm, 0);
					//获取月累积
					$scope.monthdate(y, 4, $scope.ry, 0);

					switch($scope.id) {
						case 4:
							for(var i = 0; i < $scope.dayuse1.length; i++) {
								if(i == x) {
									$scope.dayuse1[i].color = x;
								} else {
									$scope.dayuse1[i].color = 111;
								}
							}
							break;

						case 5:
							for(var i = 0; i < $scope.dayuse2.length; i++) {
								if(i == x) {
									$scope.dayuse2[i].color = x;
								} else {
									$scope.dayuse2[i].color = 111;
								}
							}
							break;

						default:
							break;
					}
				}
			}

			$scope.dealtime = function(a, b, c) {
				var tt = $scope.selected.split('-');
				$scope.ry = tt[0];
				$scope.rm = tt[1];
				$scope.rd = tt[2];
				if($scope.rd == $scope.tday) {
					if(Number($scope.rd) != 1) {
						dd = $scope.rd - 1;
					} else {
						switch(Number($scope.rm)) {
							case 1:
								$scope.ry = $scope.ry - 1;
								$scope.rm = 12;
								dd = 31;
								break;
							case 2:
								$scope.rm = 1;
								dd = 31;
								break;
							case 3:
								$scope.rm = 2;
								if($scope.ry % 4 == 0 && $scope.ry % 100 != 0) {
									dd = 29;
								} else {
									dd = 28;
								}
								break;
							case 4:
								$scope.rm = 3;
								dd = 31;
								break;
							case 5:
								$scope.rm = 4;
								dd = 30;
								break;
							case 6:
								$scope.rm = 5;
								dd = 31;
								break;
							case 7:
								$scope.rm = 6;
								dd = 30;
								break;
							case 8:
								$scope.rm = 7;
								dd = 31;
								break;
							case 9:
								$scope.rm = 8;
								dd = 31;
								break;
							case 10:
								$scope.rm = 9;
								dd = 30;
								break;
							case 11:
								$scope.rm = 10;
								dd = 31;
								break;
							case 12:
								$scope.rm = 11;
								dd = 30;
								break;
							default:
								break;
						}
					}
				} else {
					dd = $scope.rd;
				}
				if(b == 2) {
					$scope.detail(a, b, tt[0], tt[1], tt[2], c);
				} else {
					$scope.detail(a, b, $scope.ry, $scope.rm, dd, c);
				}

			}

			$scope.ddayinit = ['10.0', '4.9', '7.0', '23.2', '25.6', '76.7', '115.6', '122.2', '132.6', '50.0', '6.4', '13.3', '32.0', '4.9', '7.0', '23.2', '25.6', '76.7', '135.6', '162.2', '32.6', '20.0', '6.4', '3.3', '2.3', '3.5', '4.0', '5', '6', '7', '8'];
			$scope.dmoninit = ['2.0', '14.9', '7.0', '23.2', '25.6', '76.7', '135.6', '162.2', '32.6', '20.0', '6.4', '3.3'];
			$scope.dataday = $scope.ddayinit;
			$scope.datamon = $scope.dmoninit;
			$scope.dayp = $scope.ddayinit;
			$scope.monp = $scope.dmoninit;
			$scope.dayp2 = $scope.ddayinit;
			$scope.monp2 = $scope.dmoninit;

			//			$scope.reechart = function(){
			//				$scope.titday = '';
			//				$scope.titmonth = '';
			//				$scope.dataday = $scope.ddayinit;
			//				$scope.datamon = $scope.dmoninit;
			//				$scope.init();
			//				$scope.init2();
			//			}

			$scope.titname = '';
			$scope.det1 = function() {
				clearInterval($scope.pushid);
				$scope.detaildata = [];
				$scope.change = true;
				$scope.id = '';
				$scope.iid = '';
				$scope.type = '';
				$scope.titname = '';
				$scope.titname = $scope.pdata[0].productName;
				$scope.type = '当日生产量';
				$scope.iid = 1;
				$scope.id = 1;
				$scope.dealtime(1, 1, 0);
				$scope.tit = 'EOG 当日生产量(T)';
				$scope.btnday = '日产量';
				$scope.btnmon = '月产量';
				document.getElementById('0').style.display = "none";
				document.getElementById('d1').style.display = "block";
				document.getElementById('q').style.display = "block";
				$scope.clear2();
			}
			$scope.det2 = function() {
				clearInterval($scope.pushid);
				$scope.detaildata = [];

				$scope.dataday = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
				$scope.datamon = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
				$scope.init();
				$scope.change = true;
				$scope.id = '';
				$scope.iid = '';
				$scope.type = '';
				$scope.titname = '';
				$scope.titname = $scope.pdata[1].productName;
				$scope.type = '当日出货量';
				$scope.iid = 2;
				$scope.id = 2;
				$scope.dealtime(1, 2, 0);
				$scope.tit = 'EOG 当日出货量(T)';
				$scope.btnday = '日出货量';
				$scope.btnmon = '月出货量';
				//				document.getElementById('d0').style.display = "none";
				//				document.getElementById('d1').style.display = "block";
				//				document.getElementById('dd1').style.display = "block";
				//				document.getElementById('date').style.display = "none";
				//				document.getElementById('crice2').style.display = "none";
				//				document.getElementById('text').style.display = "block";
				//
				//				document.getElementById('tab1').style.backgroundColor = "#0059BC";
				//				document.getElementById('tab2').style.backgroundColor = "#6ba4fa";
				//				document.getElementById('d12').style.display = "block";
				//				document.getElementById('d13').style.display = "none";
				//				document.getElementById('ref').style.display = 'none';
				document.getElementById('0').style.display = "none";
				document.getElementById('d1').style.display = "block";
				document.getElementById('q').style.display = "block";
				$scope.clear2();
			}
			$scope.det3 = function() {
				clearInterval($scope.pushid);
				$scope.detaildata = [];
				$scope.change = true;
				$scope.id = '';
				$scope.iid = '';
				$scope.type = '';
				$scope.titname = '';
				$scope.titname = $scope.pdata[3].productName;
				$scope.type = '当日生产量';
				$scope.iid = 3;
				$scope.id = 1;
				$scope.dealtime(2, 1, 0);
				$scope.tit = 'ASU 当日生产量(T)';
				$scope.btnday = '日产量';
				$scope.btnmon = '月产量';
				document.getElementById('0').style.display = "none";
				document.getElementById('d1').style.display = "block";
				document.getElementById('q').style.display = "block";
				$scope.clear2();
			}
			$scope.det4 = function() {
				clearInterval($scope.pushid);
				$scope.detaildata = [];

				$scope.dataday = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
				$scope.datamon = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
				$scope.init();

				$scope.change = true;
				$scope.id = '';
				$scope.iid = '';
				$scope.type = '';
				$scope.titname = '';
				$scope.titname = $scope.pdata[4].productName;
				$scope.type = '当日出货量';
				$scope.iid = 4;
				$scope.id = 2;
				$scope.dealtime(2, 2, 0);
				$scope.tit = 'ASU 当日出货量(T)';
				$scope.btnday = '日出货量';
				$scope.btnmon = '月出货量';
				document.getElementById('0').style.display = "none";
				document.getElementById('d1').style.display = "block";
				document.getElementById('q').style.display = "block";
				$scope.clear2();
			}
			$scope.det5 = function() {
				clearInterval($scope.pushid);
				$scope.detaildata = [];
				$scope.change = true;
				$scope.id = '';
				$scope.iid = '';
				$scope.iid = 5;
				$scope.id = 3;
				$scope.dealtime(1, 3, 0);
				$scope.titname = '';
				$scope.titname = $scope.pdata[2].productName;
				$scope.tit = 'EOG 当日结余量(T)'
				$scope.btnday = '日库存量';
				$scope.btnmon = '月库存量';
				document.getElementById('0').style.display = "none";
				document.getElementById('d4').style.display = "block";
				document.getElementById('q').style.display = "block";

				//				document.getElementById('dd1').style.display = "block";
				//				document.getElementById('date').style.display = "none";
				document.getElementById('crice3').style.display = "none";
				//				document.getElementById('ref').style.display = 'none';
				//				document.getElementById('text').style.display = "block";

				$scope.clear2();
			}
			$scope.det6 = function() {
				clearInterval($scope.pushid);
				$scope.detaildata = [];
				$scope.change = true;
				$scope.id = '';
				$scope.iid = '';
				$scope.iid = 6;
				$scope.id = 3;
				$scope.dealtime(2, 3, 0);
				$scope.titname = '';
				$scope.titname = $scope.pdata[5].productName;
				$scope.tit = 'ASU 当日结余量(T)'
				$scope.btnday = '日库存量';
				$scope.btnmon = '月库存量';
				document.getElementById('0').style.display = "none";
				document.getElementById('d4').style.display = "block";
				document.getElementById('q').style.display = "block";

				//				document.getElementById('dd1').style.display = "block";
				//				document.getElementById('date').style.display = "none";
				document.getElementById('crice6').style.display = "none";
				//				document.getElementById('ref').style.display = 'none';
				//				document.getElementById('text').style.display = "block";

				$scope.clear2();
			}

			$scope.det8 = function(num, name) {
				clearInterval($scope.pushid);
				$scope.change = true;
				//				$scope.reechart();
				$scope.iid = undefined;
				$scope.id = '';
				$scope.id = 4;
				$scope.tit = '原料当日耗用量(T)'
				$scope.btnday = '日耗用';
				$scope.btnmon = '月耗用';
				$scope.perday = '日单耗';
				$scope.permon = '月单耗';
				$scope.mark2(0, num, name, true);
				document.getElementById('0').style.display = "none";
				document.getElementById('d5').style.display = "block";
				document.getElementById('q').style.display = "block";

				$scope.clear1();
			}

			$scope.det9 = function(num, name) {
				clearInterval($scope.pushid);
				$scope.change = true;
				//				$scope.reechart();
				$scope.iid = undefined;
				$scope.id = '';
				$scope.id = 5;
				$scope.tit = '能源当日耗用量(T)'
				$scope.btnday = '日耗用';
				$scope.btnmon = '月耗用';
				$scope.perday = '日单耗';
				$scope.permon = '月单耗';
				$scope.mark2(0, num, name, true);
				document.getElementById('0').style.display = "none";
				document.getElementById('de5').style.display = "block";
				document.getElementById('q').style.display = "block";

				$scope.clear1();
			}

			$scope.det10 = function() {

				document.getElementById('0').style.display = "none";
				document.getElementById('de6').style.display = "block";
				document.getElementById('q').style.display = "block";

			}
			$scope.det11 = function() {

				document.getElementById('0').style.display = "none";
				document.getElementById('de7').style.display = "block";
				document.getElementById('q').style.display = "block";

			}
			$scope.det12 = function() {

				document.getElementById('0').style.display = "none";
				document.getElementById('de8').style.display = "block";
				document.getElementById('q').style.display = "block";

			}

			//			$scope.pinit = 0;
			$scope.det7 = function(p) {
				clearInterval($scope.pushid);
				$scope.change = true;
				//				$scope.reechart();
				$scope.id = '';
				$scope.id = 6;
				//				$scope.pricetype = 2;
				//				if($scope.pinit == 0) {
				//					
				//				}

				switch(p.classID) {
					case '200':
						$scope.pricetype = 3;
						$scope.table10();
						break;
					case '317':
						$scope.pricetype = 1;
						$scope.table11();
						break;
					case '332':
						$scope.pricetype = 2;
						$scope.table12();
						break;
					case '461':
						$scope.pricetype = 2;
						$scope.table13();
						break;
					case '340':
						$scope.pricetype = 2;
						$scope.table14();
						break;
					case '375':
						$scope.pricetype = 2;
						$scope.table15();
						break;
					default:
						break;
				}

				//				document.getElementById('d3').style.display = "none";
				//				document.getElementById('d2').style.display = "block";
				//				document.getElementById('dd2').style.display = "block";
				//				document.getElementById('date').style.display = "none";
				document.getElementById('crice9').style.display = "none";
				//				document.getElementById('ref').style.display = 'none';
				//				document.getElementById('text').style.display = "block";
				document.getElementById('0').style.display = "none";
				document.getElementById('d2').style.display = "block";
				document.getElementById('q').style.display = "block";

				$scope.clear1();

			}

			$scope.time1 = function() {
				switch($scope.pricetype) {
					case 1:
						$scope.init4($scope.week2, $scope.weekdata2, 2);
						break;
					case 2:
						$scope.init4($scope.week, $scope.weekdata, 1);
						break;
					case 3:
						$scope.init4($scope.week3, $scope.weekdata3, 3);
						break;
					default:
						break;
				}
				document.getElementById('a44').style.backgroundColor = "#ffe0b2";
				document.getElementById('a55').style.backgroundColor = "transparent";
				document.getElementById('a66').style.backgroundColor = "transparent";
				document.getElementById('a77').style.backgroundColor = "transparent";

			}
			$scope.time2 = function() {
				switch($scope.pricetype) {
					case 1:
						$scope.init4($scope.week2j, $scope.weekdata2j, 2);
						break;
					case 2:
						
						$scope.init4($scope.weekj, $scope.weekdataj, 1);
						break;
					case 3:
						$scope.init4($scope.week3j, $scope.weekdata3j, 3);
						break;
					default:
						break;
				}
				document.getElementById('a55').style.backgroundColor = "#ffe0b2";
				document.getElementById('a44').style.backgroundColor = "transparent";
				document.getElementById('a66').style.backgroundColor = "transparent";
				document.getElementById('a77').style.backgroundColor = "transparent";

			}
			$scope.time3 = function() {
				switch($scope.pricetype) {
					case 1:
						$scope.init4($scope.week2b, $scope.weekdata2b, 2);
						break;
					case 2:
						$scope.init4($scope.weekb, $scope.weekdatab, 1);
						break;
					case 3:
						$scope.init4($scope.week3b, $scope.weekdata3b, 3);
						break;
					default:
						break;
				}
				document.getElementById('a66').style.backgroundColor = "#ffe0b2";
				document.getElementById('a44').style.backgroundColor = "transparent";
				document.getElementById('a55').style.backgroundColor = "transparent";
				document.getElementById('a77').style.backgroundColor = "transparent";

			}
			$scope.time4 = function() {
				switch($scope.pricetype) {
					case 1:
						$scope.init4($scope.week2n, $scope.weekdata2n, 2);
						break;
					case 2:
						$scope.init4($scope.weekn, $scope.weekdatan, 1);
						break;
					case 3:
						$scope.init4($scope.week3n, $scope.weekdata3n, 3);
						break;
					default:
						break;
				}
				document.getElementById('a77').style.backgroundColor = "#ffe0b2";
				document.getElementById('a44').style.backgroundColor = "transparent";
				document.getElementById('a55').style.backgroundColor = "transparent";
				document.getElementById('a66').style.backgroundColor = "transparent";

			}

			$scope.pricetype = 2; //价格种类:1.国际价，2.出厂价，3.市场价
			$scope.inter = function() {
				$scope.pricetype = 1;
				$scope.trans = true;
				$scope.mtrans = false;
				$scope.iflist = 0;
				document.getElementById('price1').style.display = "none";
				document.getElementById('price2').style.opacity = "1";
				document.getElementById('price2').style.display = "block";
				document.getElementById('ptab1').style.display = "none";
				document.getElementById('ptab2').style.display = "none";
				document.getElementById('p2').style.display = "none";
				document.getElementById('p3').style.display = "none";
				document.getElementById('ptab3').style.display = "none";
				document.getElementById('ptab').style.display = "none";
				document.getElementById('a11').style.backgroundColor = "#303f9f";
				document.getElementById('a22').style.backgroundColor = "transparent";
				document.getElementById('a33').style.backgroundColor = "transparent";
				document.getElementById('a11').style.color = "#ffffff";
				document.getElementById('a22').style.color = "#fff8e1";
				document.getElementById('a33').style.color = "#fff8e1";
				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";
			}
			$scope.chin8 = function() {
				$scope.pricetype = 1;
				$scope.trans = true;
				$scope.mtrans = false;
				document.getElementById('price1').style.display = "none";
				document.getElementById('price2').style.opacity = "1";
				document.getElementById('price2').style.display = "block";
				document.getElementById('ptab1').style.display = "none";
				document.getElementById('ptab2').style.display = "none";
				document.getElementById('p2').style.display = "none";
				document.getElementById('p3').style.display = "none";
				document.getElementById('ptab3').style.display = "none";
				document.getElementById('ptab').style.display = "none";
				document.getElementById('a11').style.backgroundColor = "#303f9f";
				document.getElementById('a22').style.backgroundColor = "transparent";
				document.getElementById('a33').style.backgroundColor = "transparent";
				document.getElementById('a11').style.color = "#ffffff";
				document.getElementById('a22').style.color = "#fff8e1";
				document.getElementById('a33').style.color = "#fff8e1";
				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";
			}
			$scope.chin = function() {
				$scope.pricetype = 2;
				$scope.trans = true;
				$scope.mtrans = false;
				$scope.iflist = 0;
				document.getElementById('price2').style.display = "none";
				document.getElementById('price1').style.display = "block";
				document.getElementById('price1').style.opacity = "1";
				document.getElementById('ptab1').style.display = "none";
				document.getElementById('ptab2').style.display = "none";
				document.getElementById('p2').style.display = "none";
				document.getElementById('p3').style.display = "none";
				document.getElementById('ptab3').style.display = "none";
				document.getElementById('ptab').style.display = "none";
				document.getElementById('a22').style.backgroundColor = "#303f9f";
				document.getElementById('a11').style.backgroundColor = "transparent";
				document.getElementById('a33').style.backgroundColor = "transparent";
				document.getElementById('a22').style.color = "#ffffff";
				document.getElementById('a11').style.color = "#fff8e1";
				document.getElementById('a33').style.color = "#fff8e1";
				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";

			}
			$scope.chin7 = function() {
				$scope.pricetype = 2;
				$scope.trans = true;
				$scope.mtrans = false;
				if($scope.ifdone == 1) {
					switch($scope.cID) {
						case '200':
							$scope.table10();
							break;
						case '317':
							$scope.table11();
							break;
						case '332':
							$scope.table12();
							break;
						case '461':
							$scope.table13();
							break;
						case '340':
							$scope.table14();
							break;
						case '375':
							$scope.table15();
							break;
						default:
							break;
					}
				} else {
					document.getElementById('price2').style.display = "none";
					document.getElementById('price1').style.display = "block";
					document.getElementById('price1').style.opacity = "1";
					document.getElementById('ptab1').style.display = "none";
					document.getElementById('ptab2').style.display = "none";
					document.getElementById('p2').style.display = "none";
					document.getElementById('p3').style.display = "none";
					document.getElementById('ptab3').style.display = "none";
					document.getElementById('ptab').style.display = "none";
					document.getElementById('a22').style.backgroundColor = "#303f9f";
					document.getElementById('a11').style.backgroundColor = "transparent";
					document.getElementById('a33').style.backgroundColor = "transparent";
					document.getElementById('a22').style.color = "#ffffff";
					document.getElementById('a11').style.color = "#fff8e1";
					document.getElementById('a33').style.color = "#fff8e1";
				}

			}
			$scope.chin4 = function() {
				$scope.pricetype = 3;
				$scope.mtrans = true;
				$scope.trans = true;
				$scope.iflist = 0;
				document.getElementById('price2').style.display = "none";
				document.getElementById('price1').style.display = "none";
				document.getElementById('ptab1').style.display = "none";
				document.getElementById('ptab2').style.display = "none";
				document.getElementById('ptab').style.display = "none";
				document.getElementById('p2').style.display = "none";
				document.getElementById('p3').style.display = "block";
				document.getElementById('a33').style.backgroundColor = "#303f9f";
				document.getElementById('a22').style.backgroundColor = "transparent";
				document.getElementById('a11').style.backgroundColor = "transparent";
				document.getElementById('a33').style.color = "#ffffff";
				document.getElementById('a22').style.color = "#fff8e1";
				document.getElementById('a11').style.color = "#fff8e1";
				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";

				//获取市场价
				var t = window.localStorage.getItem('token');
				if($scope.editc == 1) {
					$scope.getprice($scope.cID, 25, 0, 0, t, $scope.selected, 0, 0, 0, 4, 0);
				} else {
					alt('请选择物料')
				}

			}

			$scope.tit7 = '';

			//清空数据
			$scope.cle3 = function(p) {
				$scope.week3 = [];
				$scope.weekdata3 = [];
				$scope.week3j = [];
				$scope.weekdata3j = [];
				$scope.week3b = [];
				$scope.weekdata3b = [];
				$scope.week3n = [];
				$scope.weekdata3n = [];
				$scope.tit7 = '';
				$scope.tit7 = p.marketName;
				$scope.init4($scope.week3, $scope.weekdata3, 3);
			}

			$scope.chin5 = function(p) {
					$scope.cle3(p);
					var t = window.localStorage.getItem('token');
					$scope.getprice(p.classID, 25, p.marketNo, 0, t, $scope.selected, 0, 0, 0, 5, 30);
					$scope.getprice(p.classID, 25, p.marketNo, 0, t, $scope.selected, 0, 0, 0, 5, 90);
					$scope.getprice(p.classID, 25, p.marketNo, 0, t, $scope.selected, 0, 0, 0, 5, 180);
					$scope.getprice(p.classID, 25, p.marketNo, 0, t, $scope.selected, 0, 0, 0, 5, 360);
					document.getElementById('p3').style.display = "none";
					document.getElementById('ptab').style.display = "block";
					document.getElementById('ptab3').style.display = "block";
					document.getElementById('text').style.display = "none";
					document.getElementById('a44').style.display = "block";
					document.getElementById('a55').style.display = "block";
					document.getElementById('a66').style.display = "block";
					document.getElementById('a77').style.display = "block";
					document.getElementById('a44').style.backgroundColor = "#ffe0b2";
					document.getElementById('a55').style.backgroundColor = "transparent";
					document.getElementById('a66').style.backgroundColor = "transparent";
					document.getElementById('a77').style.backgroundColor = "transparent";
				}
				//清空数据
			$scope.cle2 = function(p) {
				$scope.week = [];
				$scope.weekdata = [];
				$scope.weekj = [];
				$scope.weekdataj = [];
				$scope.weekb = [];
				$scope.weekdatab = [];
				$scope.weekn = [];
				$scope.weekdatan = [];
				$scope.tit7 = '';
				$scope.tit7 = p.marketName;
				$scope.init4($scope.week, $scope.weekdata, 1);
			}

			$scope.chin2 = function(p) {
				$scope.cle2(p);
				var t = window.localStorage.getItem('token');
				$scope.getprice(p.classID, 24, p.marketNo, 0, t, $scope.selected, 0, 0, 0, 2, 30);
				$scope.getprice(p.classID, 24, p.marketNo, 0, t, $scope.selected, 0, 0, 0, 2, 90);
				$scope.getprice(p.classID, 24, p.marketNo, 0, t, $scope.selected, 0, 0, 0, 2, 180);
				$scope.getprice(p.classID, 24, p.marketNo, 0, t, $scope.selected, 0, 0, 0, 2, 360);
				document.getElementById('p2').style.display = "none";
				document.getElementById('ptab1').style.display = "block";
				document.getElementById('text').style.display = "none";
				document.getElementById('a44').style.display = "block";
				document.getElementById('a55').style.display = "block";
				document.getElementById('a66').style.display = "block";
				document.getElementById('a77').style.display = "block";
				document.getElementById('a44').style.backgroundColor = "#ffe0b2";
				document.getElementById('a55').style.backgroundColor = "transparent";
				document.getElementById('a66').style.backgroundColor = "transparent";
				document.getElementById('a77').style.backgroundColor = "transparent";
				//				if ($scope.week.length == 0 || $scope.weekdata.length == 0) {
				//					$scope.getprice(p.classID, 24, p.marketNo, 0, t, $scope.selected, 0, 0, 0, 2, 30);
				//				} else{
				//					
				//				}

			}
			$scope.chin3 = function() {
				document.getElementById('p2').style.display = "block";
				document.getElementById('ptab1').style.display = "none";
				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";

			}
			$scope.chin6 = function() {
					document.getElementById('p3').style.display = "block";
					document.getElementById('ptab').style.display = "none";
					document.getElementById('text').style.display = "block";
					document.getElementById('a44').style.display = "none";
					document.getElementById('a55').style.display = "none";
					document.getElementById('a66').style.display = "none";
					document.getElementById('a77').style.display = "none";

				}
				//echarts	
			$scope.init = function(id, y) {
				myCharta.setOption({
					title: {
						text: $scope.titday,
						top: '0px',
						left: '2px'
					},
					series: [{
						name: '日累积量',
						type: 'bar',
						//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
						data: $scope.dataday,
						markPoint: {
							data: [{
								type: 'max',
								name: '最大值'
							}, {
								type: 'min',
								name: '最小值'
							}]
						},

					}]
				})

				$scope.smax = 0;
				$scope.wmax = 0;
				$scope.wmin = 0;
				if(id == 3) {
					$scope.smax = $scope.storemax[y];
					$scope.wmax = $scope.warnmax[y];
					$scope.wmin = $scope.warnmin[y];

					myChartab.setOption({
						title: {
							text: $scope.titday,
							top: '0px',
							left: '2px'
						},
						yAxis: [{
							max: $scope.smax
						}],

						visualMap: {
							top: 10,
							right: 10,
							orient: 'horizontal',
							pieces: [{
								gt: 0,
								lte: $scope.wmin,
								color: '#40c4ff'
							}, {
								gt: $scope.wmin,
								lte: $scope.wmax,
								color: '#ffb300'
							}, {
								gt: $scope.wmax,
								lte: $scope.smax,
								color: '#ec407a'
							}]
						},
						series: [{
							name: '日库存量',
							type: 'line',
							//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
							data: $scope.dataday,
							markPoint: {
								data: [{
									type: 'max',
									name: '最大值'
								}, {
									type: 'min',
									name: '最小值'
								}]
							},
							markLine: {

								data: [{
									yAxis: $scope.wmin,
									name: '低报',
									lineStyle: {
										normal: {
											color: '#40c4ff'
										}
									},
								}, {
									yAxis: $scope.wmax,
									name: '高报',
									lineStyle: {
										normal: {
											color: '#ec407a'
										}
									},
								}]
							}
						}]
					})

				}

				myChartaa.setOption({
					title: {
						text: $scope.titmonth,
						top: '0px',
						left: '2px'
					},
					series: [{
						name: '月累积量',
						type: 'bar',
						//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
						data: $scope.datamon,
						markPoint: {
							data: [{
								type: 'max',
								name: '最大值'
							}, {
								type: 'min',
								name: '最小值'
							}]
						},

					}]
				})

				//原料日累积
				myCharts1.setOption({
					title: {
						text: $scope.titday,
						top: '0px',
						left: '2px'
					},
					series: [{
						name: '日累积量',
						type: 'line',
						//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
						data: $scope.dataday,
						markPoint: {
							data: [{
								type: 'max',
								name: '最大值'
							}, {
								type: 'min',
								name: '最小值'
							}]
						},

					}]
				})

				//原料月累计
				myCharts2.setOption({
					title: {
						text: $scope.titmonth,
						top: '0px',
						left: '2px'
					},
					series: [{
						name: '月累积量',
						type: 'line',
						data: $scope.datamon,
						markPoint: {
							data: [{
								type: 'max',
								name: '最大值'
							}, {
								type: 'min',
								name: '最小值'
							}]
						},

					}]
				})

				//能源日累积
				myCharte1.setOption({
						title: {
							text: $scope.titday,
							top: '0px',
							left: '2px'
						},
						series: [{
							name: '日累积量',
							type: 'line',
							//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
							data: $scope.dataday,
							markPoint: {
								data: [{
									type: 'max',
									name: '最大值'
								}, {
									type: 'min',
									name: '最小值'
								}]
							},
							//							markLine: {
							//								data: [{
							//									type: 'average',
							//									name: '平均值'
							//								}]
							//							}
						}]
					})
					//能源月累计
				myCharte2.setOption({
					title: {
						text: $scope.titmonth,
						top: '0px',
						left: '2px'
					},
					series: [{
						name: '月累积量',
						type: 'line',
						data: $scope.datamon,
						markPoint: {
							data: [{
								type: 'max',
								name: '最大值'
							}, {
								type: 'min',
								name: '最小值'
							}]
						},
						//						markLine: {
						//							data: [{
						//								type: 'average',
						//								name: '平均值'
						//							}]
						//						}
					}]
				})
			}

			$scope.init2 = function() {
					//原料日单耗
					myChart.setOption({
							title: {
								text: $scope.titday1,
								top: '0px',
								left: '2px'
							},
							series: [{
								name: '日单耗',
								type: 'line',
								//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
								data: $scope.dayp,
								markPoint: {
									data: [{
										type: 'max',
										name: '最大值'
									}, {
										type: 'min',
										name: '最小值'
									}]
								},

							}]
						})
						//原料月单耗
					myChart1.setOption({
						title: {
							text: $scope.titmonth1,
							top: '0px',
							left: '2px'
						},
						series: [{
							name: '月单耗',
							type: 'line',
							//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
							data: $scope.monp,
							markPoint: {
								data: [{
									type: 'max',
									name: '最大值'
								}, {
									type: 'min',
									name: '最小值'
								}]
							},

						}]
					})

				} //end init2

			$scope.init2s = function() {
					//能源日单耗
					myChart20.setOption({
							title: {
								text: $scope.titday2,
								top: '0px',
								left: '2px'
							},
							series: [{
								name: '日单耗',
								type: 'line',
								//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
								data: $scope.dayp2,
								markPoint: {
									data: [{
										type: 'max',
										name: '最大值'
									}, {
										type: 'min',
										name: '最小值'
									}]
								},

							}]
						})
						//能源月单耗
					myChart21.setOption({
						title: {
							text: $scope.titmonth2,
							top: '0px',
							left: '2px'
						},
						series: [{
							name: '月单耗',
							type: 'line',
							//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
							data: $scope.monp2,
							markPoint: {
								data: [{
									type: 'max',
									name: '最大值'
								}, {
									type: 'min',
									name: '最小值'
								}]
							},
							//							markLine: {
							//								data: [{
							//									type: 'average',
							//									name: '平均值'
							//								}]
							//							}
						}]
					})

				} //end init2s

			var myCharta = echarts.init(document.getElementById("d12"));
			myCharta.setOption({

				title: {
					text: $scope.titday,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,
					formatter: '{b}<br/>日累积量 :{c}T',
					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				toolbox: {
					itemSize: 22,
					top: '0px',
					itemGap: 20,
					left: 510,
					show: true,
					showTitle: false,
					feature: {
						magicType: {
							show: true,
							type: ['line', 'bar'],
							iconStyle: {
								normal: {
									borderColor: "000000"
								},
								emphasis: {
									borderColor: "000000"
								}
							}
						},

					}
				},
				color: ['#ff9800'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					boundaryGap: false,
					type: 'category',
					data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '日累积量',
					type: 'bar',
					data: ['2.0', '4.9', '7.0', '23.2', '25.6', '76.7', '115.6', '122.2', '2.0', '4.9', '7.0', '23.2', '25.6', '76.7', '115.6', '122.2', '2.0', '4.9', '7.0', '23.2', '25.6', '76.7', '115.6', '122.2', '2.0', '4.9', '7.0', '23.2', '25.6', '76.7', '115.6', '122.2'],
					//					data: $scope.dataday,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值',
							textStyle: {
								fontSize: '20',
								color: '#ec407a'
							}
						}, {
							type: 'min',
							name: '最小值',
							color: '#ec407a',
							fontSize: '20'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 48,
					},

				}]
			});
			var myChartab = echarts.init(document.getElementById("d121"));
			myChartab.setOption({
				title: {
					text: $scope.titday,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,
					formatter: '{b}<br/>日库存量 :{c}T',
					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				//				toolbox: {
				//					itemSize: 22,
				//					top: '0px',
				//					itemGap: 20,
				//					left: 510,
				//					show: true,
				//					showTitle: false,
				//					feature: {
				//						magicType: {
				//							show: true,
				//							type: ['line','bar'],
				//							iconStyle: {
				//								normal: {
				//									borderColor: "000000"
				//								},
				//								emphasis: {
				//									borderColor: "000000"
				//								}
				//							}
				//						},
				//					}
				//				},
				color: ['#ff9800'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value',
					scale: true,
					max: $scope.smax
				}],

				visualMap: {
					top: 10,
					right: 10,
					orient: 'horizontal',
					pieces: [{
						gt: 0,
						lte: 300, //$scope.wmin,
						color: '#40c4ff'
					}, {
						gt: 300, //$scope.wmin,
						lte: 1300, //$scope.wmax,
						color: '#ffb300'
					}, {
						gt: 1300, //$scope.wmax,
						lte: 3000, //$scope.smax,
						color: '#ec407a'
					}]
				},
				series: [{
					name: '日库存量',
					type: 'line',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
					data: $scope.dataday,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 48,
					},
					markLine: {

						data: [{
							yAxis: '300', //$scope.wmin,
							name: '低报',
							lineStyle: {
								normal: {
									color: '#40c4ff'
								}
							},
						}, {
							yAxis: '1300', //$scope.wmax,
							name: '高报',
							lineStyle: {
								normal: {
									color: '#ec407a'
								}
							},
						}]
					}
				}]
			});
			var myChart = echarts.init(document.getElementById("d122"));
			myChart.setOption({
				title: {
					text: $scope.perday,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				//				toolbox: {
				//					itemSize: 22,
				//					top: '0px',
				//					itemGap: 20,
				//					left: 510,
				//					show: true,
				//					showTitle: false,
				//					feature: {
				//						magicType: {
				//							show: true,
				//							type: ['line', 'bar'],
				//							iconStyle: {
				//								normal: {
				//									borderColor: "000000"
				//								},
				//								emphasis: {
				//									borderColor: "000000"
				//								}
				//							}
				//						},
				//						//											restore: {
				//						//												show: true
				//						//											}
				//					}
				//				},
				color: ['#ef6c00'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value',
					scale: true
				}],
				series: [{
					name: '日单耗',
					type: 'line',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
					data: $scope.dayp,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 70,
					},

				}]
			});
			//			原料日累积
			var myCharts1 = echarts.init(document.getElementById("ds122"));
			myCharts1.setOption({
				title: {
					text: $scope.titday,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				//				toolbox: {
				//					itemSize: 22,
				//					top: '0px',
				//					itemGap: 20,
				//					left: 510,
				//					show: true,
				//					showTitle: false,
				//					feature: {
				//						magicType: {
				//							show: true,
				//							type: ['line', 'bar'],
				//							iconStyle: {
				//								normal: {
				//									borderColor: "000000"
				//								},
				//								emphasis: {
				//									borderColor: "000000"
				//								}
				//							}
				//						},
				//						//											restore: {
				//						//												show: true
				//						//											}
				//					}
				//				},
				color: ['#ef6c00'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value',
					scale: true
				}],
				series: [{
					name: '日累积量',
					type: 'line',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
					data: $scope.dataday,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 70,
					},

				}]
			});

			var myChart20 = echarts.init(document.getElementById("des122"));
			myChart20.setOption({
				title: {
					text: $scope.titday2,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				//				toolbox: {
				//					itemSize: 22,
				//					top: '0px',
				//					itemGap: 20,
				//					left: 510,
				//					show: true,
				//					showTitle: false,
				//					feature: {
				//						magicType: {
				//							show: true,
				//							type: ['line', 'bar'],
				//							iconStyle: {
				//								normal: {
				//									borderColor: "000000"
				//								},
				//								emphasis: {
				//									borderColor: "000000"
				//								}
				//							}
				//						},
				//						//											restore: {
				//						//												show: true
				//						//											}
				//					}
				//				},
				color: ['#ef6c00'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value',
					scale: true
				}],
				series: [{
					name: '日单耗',
					type: 'line',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
					data: $scope.dayp2,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 70,
					},

				}]
			});

			var myChart21 = echarts.init(document.getElementById("des132"));
			myChart21.setOption({
				title: {
					text: $scope.titmonth2,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				grid: {
					backgroundColor: "#ffffff"
				},
				//				toolbox: {
				//					itemSize: 22,
				//					top: '0px',
				//					itemGap: 20,
				//					left: 510,
				//					show: true,
				//					showTitle: false,
				//					feature: {
				//						magicType: {
				//							show: true,
				//							type: ['line', 'bar'],
				//							iconStyle: {
				//								normal: {
				//									borderColor: "000000"
				//								},
				//								emphasis: {
				//									borderColor: "000000"
				//								}
				//							}
				//						},
				//					}
				//				},
				color: ['#ec407a'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value',
					scale: true
				}],
				series: [{
					name: '月单耗',
					type: 'line',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
					data: $scope.monp2,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 70,
					},
					//					markLine: {
					//						data: [{
					//							type: 'average',
					//							name: '平均值'
					//						}]
					//					}
				}]
			});
			//			能源日累积
			var myCharte1 = echarts.init(document.getElementById("de122"));
			myCharte1.setOption({
				title: {
					text: $scope.titday,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				//				toolbox: {
				//					itemSize: 22,
				//					top: '0px',
				//					itemGap: 20,
				//					left: 510,
				//					show: true,
				//					showTitle: false,
				//					feature: {
				//						magicType: {
				//							show: true,
				//							type: ['line', 'bar'],
				//							iconStyle: {
				//								normal: {
				//									borderColor: "000000"
				//								},
				//								emphasis: {
				//									borderColor: "000000"
				//								}
				//							}
				//						},
				//						//											restore: {
				//						//												show: true
				//						//											}
				//					}
				//				},
				color: ['#ef6c00'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value',
					scale: true
				}],
				series: [{
					name: '日累积量',
					type: 'line',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 115.6, 122.2, 132.6, 50.0, 6.4, 13.3, 32.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2, 3, 4, 5, 6, 7, 8],
					data: $scope.dataday,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 70,
					},
					//					markLine: {
					//						data: [{
					//							type: 'average',
					//							name: '平均值'
					//						}]
					//					}
				}]
			});

			var myChartaa = echarts.init(document.getElementById("d13"));
			myChartaa.setOption({
				title: {
					text: $scope.titmonth,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,
					formatter: '{b}<br/>月累积量 :{c}T',
					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				grid: {
					backgroundColor: "#ffffff"
				},
				toolbox: {
					itemSize: 22,
					top: '0px',
					itemGap: 20,
					left: 510,
					show: true,
					showTitle: false,
					feature: {
						magicType: {
							show: true,
							type: ['line', 'bar'],
							iconStyle: {
								normal: {
									borderColor: "000000"
								},
								emphasis: {
									borderColor: "000000"
								}
							}
						},
						//											restore: {
						//												show: true
						//											}
					}
				},
				color: ['#f06292'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '月累积量',
					type: 'bar',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
					data: $scope.datamon,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 48,
					},

				}]
			});
			var myChart1 = echarts.init(document.getElementById("d132"));
			myChart1.setOption({
				title: {
					text: $scope.permon,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				grid: {
					backgroundColor: "#ffffff"
				},
				//				toolbox: {
				//					itemSize: 22,
				//					top: '0px',
				//					itemGap: 20,
				//					left: 510,
				//					show: true,
				//					showTitle: false,
				//					feature: {
				//						magicType: {
				//							show: true,
				//							type: ['line', 'bar'],
				//							iconStyle: {
				//								normal: {
				//									borderColor: "000000"
				//								},
				//								emphasis: {
				//									borderColor: "000000"
				//								}
				//							}
				//						},
				//					}
				//				},
				color: ['#ec407a'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value',
					scale: true
				}],
				series: [{
					name: '月单耗',
					type: 'line',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
					data: $scope.monp,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 70,
					},

				}]
			});

			//			原料月累计
			var myCharts2 = echarts.init(document.getElementById("ds132"));
			myCharts2.setOption({
				title: {
					text: $scope.titmonth,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				grid: {
					backgroundColor: "#ffffff"
				},
				//				toolbox: {
				//					itemSize: 22,
				//					top: '0px',
				//					itemGap: 20,
				//					left: 510,
				//					show: true,
				//					showTitle: false,
				//					feature: {
				//						magicType: {
				//							show: true,
				//							type: ['line', 'bar'],
				//							iconStyle: {
				//								normal: {
				//									borderColor: "000000"
				//								},
				//								emphasis: {
				//									borderColor: "000000"
				//								}
				//							}
				//						},
				//					}
				//				},
				color: ['#ec407a'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value',
					scale: true
				}],
				series: [{
					name: '月累积量',
					type: 'line',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
					data: $scope.datamon,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 70,
					},

				}]
			});

			//能源月累计
			var myCharte2 = echarts.init(document.getElementById("de132"));
			myCharte2.setOption({
				title: {
					text: $scope.titmonth,
					top: '0px',
					left: '2px'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				grid: {
					backgroundColor: "#ffffff",
					left: 75
				},
				//				toolbox: {
				//					itemSize: 22,
				//					top: '0px',
				//					itemGap: 20,
				//					left: 510,
				//					show: true,
				//					showTitle: false,
				//					feature: {
				//						magicType: {
				//							show: true,
				//							type: ['line', 'bar'],
				//							iconStyle: {
				//								normal: {
				//									borderColor: "000000"
				//								},
				//								emphasis: {
				//									borderColor: "000000"
				//								}
				//							}
				//						},
				//					}
				//				},
				color: ['#ec407a'],
				calculable: true,
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66
				}],
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					axisLabel: {
						textStyle: {
							fontSize: '15'
						}
					},
				}],
				yAxis: [{
					type: 'value',
					scale: true
				}],
				series: [{
					name: '月累积量',
					type: 'line',
					//									data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
					data: $scope.datamon,
					markPoint: {
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}],
						label: {
							normal: {
								textStyle: {
									color: '#424242',
									fontSize: '16',
									fontWeight: '400'
								}
							}
						},
						symbolSize: 70,
					},
					//					markLine: {
					//						data: [{
					//							type: 'average',
					//							name: '平均值'
					//						}]
					//					}
				}]
			});

			var myChart2 = echarts.init(document.getElementById("text1"));;

			$scope.mc0 = function(xx, yy, zz) {
				myChart2.setOption({
					title: {
						text: '汇总差异: ' + zz,
						textStyle: {
							fontSize: '15',
							fontWeight: '600',
							color: '424242'
						},
						left: '40%'

					},
					tooltip: {
						trigger: 'item',
						hideDelay: 50,
						formatter: " {c} ({d}%)",
						textStyle: {
							fontSize: '18',
							fontWeight: '600'
						}
					},
					color: ['#fa4b97', '#40c4ff', '#b39ddb'],
					legend: {
						orient: 'vertical',
						x: '-5px',
						top: '0px',
						itemWidth: 20,
						//									itemGap:'5',
						data: ['预估剩余计划量', '当月实际产量']
					},
					//									
					calculable: true,
					series: [{
						name: 'EOG',
						type: 'pie',
						radius: ['50%', '70%'],
						itemStyle: {
							normal: {
								label: {
									show: false
								},
								labelLine: {
									show: false
								}
							},

						},
						data: [{
							value: xx, //Number($scope.pdata[0].summary_Value_Current),
							name: '当月实际产量'
						}, {
							value: yy, //Number($scope.pdata[0].summary_Value_Surplus),
							name: '预估剩余计划量'
						}]
					}]
				});
			}

			var myChart3 = echarts.init(document.getElementById("text2"));

			$scope.mc1 = function(xx, yy, zz) {
				myChart3.setOption({
					title: {
						text: '汇总差异: ' + zz,
						textStyle: {
							fontSize: '15',
							fontWeight: '600',
							color: '424242'
						},
						left: '40%'

					},
					tooltip: {
						trigger: 'item',
						hideDelay: 50,
						formatter: " {c} ({d}%)",
						textStyle: {
							fontSize: '18',
							fontWeight: '600'
						}
					},
					color: ['#f8bbd0', '#40c4ff', '#b39ddb'],
					legend: {
						orient: 'vertical',
						x: '-5px',
						top: '0px',
						itemWidth: 20,
						data: ['预估剩余计划量', '当月实际出货量']
					},
					//									
					calculable: true,
					series: [{
						name: 'EOG',
						type: 'pie',
						radius: ['50%', '70%'],
						itemStyle: {
							normal: {
								label: {
									show: false
								},
								labelLine: {
									show: false
								}
							},

						},
						data: [{
							value: xx, //Number($scope.pdata[1].summary_Value_Current),
							name: '当月实际出货量'
						}, {
							value: yy, //Number($scope.pdata[1].summary_Value_Surplus),
							name: '预估剩余计划量'
						}]
					}]
				});
			}

			var myChart4 = echarts.init(document.getElementById("text3"));
			$scope.mc3 = function(xx, yy, zz) {
				myChart4.setOption({
					title: {
						text: '汇总差异: ' + zz,
						textStyle: {
							fontSize: '15',
							fontWeight: '600',
							color: '424242'
						},
						left: '40%'

					},
					tooltip: {
						trigger: 'item',
						hideDelay: 50,
						formatter: " {c} ({d}%)",
						textStyle: {
							fontSize: '18',
							fontWeight: '600'
						}
					},
					color: ['#ffab40', '#40c4ff', '#b39ddb'],
					legend: {
						orient: 'vertical',
						x: '-5px',
						top: '0px',
						itemWidth: 20,
						data: ['预估剩余计划量', '当月实际产量']
					},
					//									
					calculable: true,
					series: [{
						name: 'ASU',
						type: 'pie',
						radius: ['50%', '70%'],
						itemStyle: {
							normal: {
								label: {
									show: false
								},
								labelLine: {
									show: false
								}
							},

						},
						data: [{
							value: xx, //Number($scope.pdata[1].summary_Value_Current),
							name: '当月实际产量'
						}, {
							value: yy, //Number($scope.pdata[1].summary_Value_Surplus),
							name: '预估剩余计划量'
						}]
					}]
				});
			}

			var myChart5 = echarts.init(document.getElementById("text4"));

			$scope.mc4 = function(xx, yy, zz) {
				myChart5.setOption({
					title: {
						text: '汇总差异: ' + zz,
						textStyle: {
							fontSize: '15',
							fontWeight: '600',
							color: '424242'
						},
						left: '40%'

					},
					tooltip: {
						trigger: 'item',
						hideDelay: 50,
						formatter: " {c} ({d}%)",
						textStyle: {
							fontSize: '18',
							fontWeight: '600'
						}
					},
					color: ['#ffe082', '#40c4ff', '#b39ddb'],
					legend: {
						orient: 'vertical',
						x: '-5px',
						top: '0px',
						itemWidth: 20,
						data: ['预估剩余计划量', '当月实际出货量']
					},
					//									
					calculable: true,
					series: [{
						name: 'ASU',
						type: 'pie',
						radius: ['50%', '70%'],
						itemStyle: {
							normal: {
								label: {
									show: false
								},
								labelLine: {
									show: false
								}
							},

						},
						data: [{
							value: xx, //Number($scope.pdata[4].summary_Value_Current),
							name: '当月实际出货量'
						}, {
							value: yy, //Number($scope.pdata[4].summary_Value_Surplus),
							name: '预估剩余计划量'
						}]
					}]
				});
			}

			var myChart6 = echarts.init(document.getElementById("text5"));

			$scope.mc2 = function(xxx, yyy, zzz) {
				myChart6.setOption({
					//					title: {
					//						text: '汇总差异: ' + zz,
					//						textStyle: {
					//							fontSize: '15',
					//							fontWeight: '600',
					//							color: '424242'
					//						},
					//						left: '40%'
					//
					//					},
					//					tooltip: {
					//						trigger: 'item',
					//						formatter: " {c} " + 'T',
					//						textStyle: {
					//							fontSize: '18',
					//							fontWeight: '600'
					//						}
					//					},
					//					color: ['#b39ddb'],
					//					legend: {
					//						orient: 'vertical',
					//						x: '-5px',
					//						top: '-8px',
					//						itemWidth: 20,
					//						data: ['当月库存']
					//					},
					//					//									
					//					calculable: true,
					//					series: [{
					//						name: 'EOG',
					//						type: 'pie',
					//						radius: ['50%', '70%'],
					//						itemStyle: {
					//							normal: {
					//								label: {
					//									show: false
					//								},
					//								labelLine: {
					//									show: false
					//								}
					//							},
					//
					//						},
					//						data: [{
					//							value: yy, //Number($scope.pdata[2].summary_Value_Surplus),
					//							name: '当月库存'
					//						}]
					//					}]

					color: ['#ffcc80', '#a5d6a7', '#ff5722', '#b39ddb', '#91a7ff'],
					tooltip: {
						trigger: 'axis',
						hideDelay: 50,
						formatter: function(params) {
							var res = '日期：' + params[0].name;
							for(var i = 0, l = params.length; i < l; i++) {
								res += '<br/>' + params[l - i - 1].seriesName + ' : ' + params[l - i - 1].data;
							}
							return res;
						}
					},
					legend: {
						left: '-2%',
						top: '7%',
						//						x: 'right',
						////						y: 'top',
						itemGap: 2,
						itemHeight: 10,
						itemWidth: 12,
						textStyle: {
							fontSize: 12,
						},
						data: xxx //类别
					},

					grid: {
						left: '1%',
						right: '4%',
						top: '18%',
						bottom: '0%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: yyy //日期
					}],
					yAxis: [{
						type: 'value',
						max: 40650,
						//						scale: true,
					}],
					series: [{
							name: zzz[4].name,
							type: 'line',
							stack: '总量',
							areaStyle: {
								normal: {}
							},
							data: zzz[4].data
						}
						//					,{
						//						name: zzz[1].name,
						//						type: 'line',
						//						stack: '总量',
						//						areaStyle: {
						//							normal: {}
						//						},
						//						data: zzz[1].data
						//					},{
						//						name: zzz[2].name,
						//						type: 'line',
						//						stack: '总量',
						//						areaStyle: {
						//							normal: {}
						//						},
						//						data: zzz[2].data
						//					},{
						//						name: zzz[3].name,
						//						type: 'line',
						//						stack: '总量',
						//						areaStyle: {
						//							normal: {}
						//						},
						//						data: zzz[3].data
						//					},{
						//						name: zzz[4].name,
						//						type: 'line',
						//						stack: '总量',
						//						areaStyle: {
						//							normal: {}
						//						},
						//						data: zzz[4].data
						//					}
						, {
							name: zzz[5].name,
							type: 'line',
							stack: '总量',
							areaStyle: {
								normal: {}
							},
							data: zzz[5].data
						}, {
							name: zzz[6].name,
							type: 'line',
							stack: '总量',
							areaStyle: {
								normal: {}
							},
							data: zzz[6].data
						}, {
							name: zzz[7].name,
							type: 'line',
							stack: '总量',
							areaStyle: {
								normal: {}
							},
							data: zzz[7].data
						}, {
							name: zzz[8].name,
							type: 'line',
							stack: '总量',
							areaStyle: {
								normal: {}
							},
							data: zzz[8].data
						}
					]
				});
			}

			var myChart7 = echarts.init(document.getElementById("text6"));
			$scope.mc5 = function(xxx, yyy, zzz) {
				myChart7.setOption({
					//					title: {
					//						text: '汇总差异: ' + zz,
					//						textStyle: {
					//							fontSize: '15',
					//							fontWeight: '600',
					//							color: '424242'
					//						},
					//						left: '40%'
					//
					//					},
					//					tooltip: {
					//						trigger: 'item',
					//						formatter: " {c} " + 'T',
					//						textStyle: {
					//							fontSize: '18',
					//							fontWeight: '600'
					//						}
					//					},
					//					color: ['#91a7ff'],
					//					legend: {
					//						orient: 'vertical',
					//						x: '-5px',
					//						top: '-8px',
					//						itemWidth: 20,
					//						data: ['当月库存']
					//					},
					//					//									
					//					calculable: true,
					//					series: [{
					//						name: 'ASU',
					//						type: 'pie',
					//						radius: ['50%', '70%'],
					//						itemStyle: {
					//							normal: {
					//								label: {
					//									show: false
					//								},
					//								labelLine: {
					//									show: false
					//								}
					//							},
					//
					//						},
					//						data: [{
					//							value: yy, //Number($scope.pdata[5].summary_Value_Surplus),
					//							name: '当月库存'
					//						}]
					//					}]

					tooltip: {
						trigger: 'axis',
						hideDelay: 50,
						formatter: function(params) {
							var res = '日期：' + params[0].name;
							for(var i = 0, l = params.length; i < l; i++) {
								res += '<br/>' + params[l - i - 1].seriesName + ' : ' + params[l - i - 1].data;
							}
							return res;
						}
					},
					legend: {
						left: '0%',
						right: '-2%',
						top: '7%',
						itemHeight: 12,
						itemWidth: 13,
						data: xxx //['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
					},

					grid: {
						left: '1%',
						right: '4%',
						top: '18%',
						bottom: '0%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: yyy //['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					}],
					yAxis: [{
						type: 'value',
						max: 3814,
						//						scale: true
					}],
					series: [{
						name: zzz[0].name, //'邮件营销',
						type: 'line',
						stack: '总量',
						areaStyle: {
							normal: {}
						},
						data: zzz[0].data //[120, 132, 101, 134, 90, 230, 210]
					}, {
						name: zzz[1].name, //'联盟广告',
						type: 'line',
						stack: '总量',
						areaStyle: {
							normal: {}
						},
						data: zzz[1].data //[220, 182, 191, 234, 290, 330, 310]
					}, {
						name: zzz[2].name, //'视频广告',
						type: 'line',
						stack: '总量',
						areaStyle: {
							normal: {}
						},
						data: zzz[2].data //[150, 232, 201, 154, 190, 330, 410]
					}]

				});
			}

			//能源耗用
			var myChart8 = echarts.init(document.getElementById("text7"));

			$scope.mc8 = function(e, p) {
				myChart8.setOption({

					//					tooltip: {
					//						trigger: 'item',
					//						hideDelay:50,
					//						formatter: "{c}KWH " + "({d}%)",
					//						textStyle: {
					//							fontSize: '18',
					//							fontWeight: '600'
					//						}
					//					},
					//					color: ['#ffcc80', '#a5d6a7', '#ff5722'],
					//					legend: {
					//						orient: 'vertical',
					//						x: '0',
					//						top: '0',
					//						itemWidth: 20,
					//						data: [e[0].materialTypeName, e[1].materialTypeName, e[2].materialTypeName]
					//					},
					//					series: [{
					//
					//						name: '访问来源',
					//						type: 'pie',
					//						radius: ['50%', '70%'],
					//						
					//						itemStyle: {
					//							normal: {
					//								label: {
					//									show: true,
					//									formatter: '{c}({d}%)',
					//									textStyle: {
					//										fontSize: '14',
					//										fontWeight: '900'
					//									},
					//								},
					//								labelLine: {
					//									show: true
					//								}
					//							}
					//
					//						},
					//						data: [{
					//							value: e[0].dataValue,
					//							name: e[0].materialTypeName
					//						}, {
					//							value: e[1].dataValue,
					//							name: e[1].materialTypeName
					//						}, {
					//							value: e[2].dataValue,
					//							name: e[2].materialTypeName
					//						}]
					//					}]

					tooltip: {
						trigger: 'axis'
					},
					color: ['#64b5f6', '#7cb342', '#ff5722', '#ba68c8', '#f08080'],
					grid: {
						left: '1%',
						right: '2%',
						//						top: '20%',
						bottom: '0%',
						containLabel: true
					},
					calculable: true,
					legend: {
						left: '-2%',
						top: '0%',
						//						x: 'right',
						////						y: 'top',
						itemGap: 5,
						itemHeight: 10,
						itemWidth: 12,
						textStyle: {
							fontSize: 12,
						},
						data: [e[0].name, e[1].name, e[2].name, p[0].name, p[1].name]
					},
					xAxis: [{
						type: 'category',
						data: $scope.energyday //['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
					}],
					yAxis: [{
						type: 'value',
						name: '日耗用(KWH)',
						axisLabel: {
							formatter: '{value}'
						}
					}, {
						type: 'value',
						name: '日单耗(KWH)',
						axisLabel: {
							formatter: '{value}'
						}
					}],
					series: [

						{
							name: e[0].name,
							type: 'bar',
							data: e[0].data //[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
						}, {
							name: e[1].name, //'降水量',
							type: 'bar',
							data: e[1].data //[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
						}, {
							name: e[2].name, //'降水量',
							type: 'bar',
							data: e[2].data //[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
						}, {
							name: p[0].name,
							type: 'line',
							yAxisIndex: 1,
							data: p[0].data //[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
						}, {
							name: p[1].name,
							type: 'line',
							yAxisIndex: 1,
							data: p[1].data //[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
						}
					]
				});
			}

			//LAR
			var myChart9 = echarts.init(document.getElementById("text8"));

			//			$scope.mc9 = function(e, p) {
			myChart9.setOption({

				tooltip: {
					trigger: 'axis'
				},
				color: ['#ffcc80', '#a5d6a7', '#f48fb1'],
				grid: {
					left: '1%',
					right: '2%',
					//						top: '20%',
					bottom: '1%',
					containLabel: true
				},
				legend: {
					data: ['含税均价', '市场价', '牌价']
				},
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				}],
				yAxis: [{
					type: 'value',
					name: '价格[元]',
					min: 0,
					max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} '
					}
				}],
				series: [{
					name: '含税均价',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
				}, {
					name: '市场价',
					type: 'bar',
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				}, {
					name: '牌价',
					type: 'line',
					//					yAxisIndex: 1,
					data: [2.0, 2.2, 3.3, 14.5, 26.3, 50.2, 80.3, 83.4, 23.0, 16.5, 12.0, 6.2]
				}]
			});

			//LIN
			var myChart10 = echarts.init(document.getElementById("text9"));

			//			$scope.mc9 = function(e, p) {
			myChart10.setOption({

				tooltip: {
					trigger: 'axis'
				},
				color: ['#ffc107', '#aed581', '#f06292'],
				grid: {
					left: '1%',
					right: '2%',
					//						top: '20%',
					bottom: '1%',
					containLabel: true
				},
				legend: {
					data: ['含税均价', '市场价', '牌价']
				},
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				}],
				yAxis: [{
					type: 'value',
					name: '价格[元]',
					min: 0,
					max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} '
					}
				}],
				series: [{
					name: '含税均价',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
				}, {
					name: '市场价',
					type: 'bar',
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				}, {
					name: '牌价',
					type: 'line',
					//					yAxisIndex: 1,
					data: [2.0, 2.2, 3.3, 14.5, 26.3, 50.2, 80.3, 83.4, 23.0, 16.5, 12.0, 6.2]
				}]
			});

			//LOX
			var myChart11 = echarts.init(document.getElementById("text10"));

			//			$scope.mc9 = function(e, p) {
			myChart11.setOption({

				tooltip: {
					trigger: 'axis'
				},
				color: ['#ffb74d', '#81c784', '#ec407a'],
				grid: {
					left: '1%',
					right: '2%',
					//						top: '20%',
					bottom: '1%',
					containLabel: true
				},
				legend: {
					data: ['含税均价', '市场价', '牌价']
				},
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				}],
				yAxis: [{
					type: 'value',
					name: '价格[元]',
					min: 0,
					max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} '
					}
				}],
				series: [{
					name: '含税均价',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
				}, {
					name: '市场价',
					type: 'bar',
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				}, {
					name: '牌价',
					type: 'line',
					//					yAxisIndex: 1,
					data: [2.0, 2.2, 3.3, 14.5, 26.3, 50.2, 80.3, 83.4, 23.0, 16.5, 12.0, 6.2]
				}]
			});

			var myChart12 = echarts.init(document.getElementById("dd6"));

			//			$scope.mc9 = function(e, p) {
			myChart12.setOption({
				title: {
					text: 'LAR销售价',
					textStyle: {
						fontSize: '15',
						fontWeight: '600',
						color: '424242'
					},
					

				},
				tooltip: {
					trigger: 'axis'
				},
				color: ['#ffcc80', '#a5d6a7', '#f48fb1'],
				grid: {
					left: '1%',
					right: '2%',
					//						top: '20%',
					bottom: '16%',
					containLabel: true
				},
				legend: {
					data: ['含税均价', '市场价', '牌价']
				},
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66,
					top: 530
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66,
					top: 530
				}],
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				}],
				yAxis: [{
					type: 'value',
					name: '价格[元]',
					min: 0,
					max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} '
					}
				}],
				series: [{
					name: '含税均价',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
				}, {
					name: '市场价',
					type: 'bar',
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				}, {
					name: '牌价',
					type: 'line',
					//					yAxisIndex: 1,
					data: [2.0, 2.2, 3.3, 14.5, 26.3, 50.2, 80.3, 83.4, 23.0, 16.5, 12.0, 6.2]
				}]
			});
			
			var myChart13 = echarts.init(document.getElementById("dd7"));

			//			$scope.mc9 = function(e, p) {
			myChart13.setOption({
				title: {
					text: 'LAR销售价',
					textStyle: {
						fontSize: '15',
						fontWeight: '600',
						color: '424242'
					},
					

				},
				tooltip: {
					trigger: 'axis'
				},
				color: ['#ffc107', '#aed581', '#f06292'],
				grid: {
					left: '1%',
					right: '2%',
					//						top: '20%',
					bottom: '16%',
					containLabel: true
				},
				legend: {
					data: ['含税均价', '市场价', '牌价']
				},
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66,
					top: 530
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66,
					top: 530
				}],
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				}],
				yAxis: [{
					type: 'value',
					name: '价格[元]',
					min: 0,
					max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} '
					}
				}],
				series: [{
					name: '含税均价',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
				}, {
					name: '市场价',
					type: 'bar',
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				}, {
					name: '牌价',
					type: 'line',
					//					yAxisIndex: 1,
					data: [2.0, 2.2, 3.3, 14.5, 26.3, 50.2, 80.3, 83.4, 23.0, 16.5, 12.0, 6.2]
				}]
			});
			
			var myChart14 = echarts.init(document.getElementById("dd8"));

			//			$scope.mc9 = function(e, p) {
			myChart14.setOption({
				title: {
					text: 'LAR销售价',
					textStyle: {
						fontSize: '15',
						fontWeight: '600',
						color: '424242'
					},
					

				},
				tooltip: {
					trigger: 'axis'
				},
				color: ['#ffb74d', '#81c784', '#ec407a'],
				grid: {
					left: '1%',
					right: '2%',
					//						top: '20%',
					bottom: '16%',
					containLabel: true
				},
				legend: {
					data: ['含税均价', '市场价', '牌价']
				},
				dataZoom: [{
					show: true,
					realtime: true,
					start: 33,
					end: 66,
					top: 530
				}, {
					type: 'inside',
					realtime: true,
					start: 33,
					end: 66,
					top: 530
				}],
				xAxis: [{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				}],
				yAxis: [{
					type: 'value',
					name: '价格[元]',
					min: 0,
					max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} '
					}
				}],
				series: [{
					name: '含税均价',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
				}, {
					name: '市场价',
					type: 'bar',
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				}, {
					name: '牌价',
					type: 'line',
					//					yAxisIndex: 1,
					data: [2.0, 2.2, 3.3, 14.5, 26.3, 50.2, 80.3, 83.4, 23.0, 16.5, 12.0, 6.2]
				}]
			});



			$scope.mapc = [
				[],
				[{
					name: '东北',
					value: 1,
					price: 0,
					size: 0
				}, {
					name: '华北',
					value: 2,
					price: 0,
					size: 0
				}, {
					name: '华南',
					value: 3,
					price: 0,
					size: 0
				}, {
					name: '华东',
					value: 5,
					price: 0,
					size: 0
				}],
				[{
					name: '华北',
					value: 2,
					price: 0,
					size: 0
				}, {
					name: '华南',
					value: 3,
					price: 0,
					size: 0
				}, {
					name: '华东',
					value: 5,
					price: 0,
					size: 0
				}],
				[{
					name: '华北',
					value: 2,
					price: 0,
					size: 0
				}, {
					name: '华南',
					value: 3,
					price: 0,
					size: 0
				}, {
					name: '华中',
					value: 4,
					price: 0,
					size: 0
				}, {
					name: '华东',
					value: 5,
					price: 0,
					size: 0
				}, {
					name: '东北',
					value: 1,
					price: 0,
					size: 0
				}, {
					name: '西北',
					value: 7,
					price: 0,
					size: 0
				}],
				[{
					name: '华北',
					value: 2,
					price: 0,
					size: 0
				}, {
					name: '华南',
					value: 3,
					price: 0,
					size: 0
				}, {
					name: '华中',
					value: 4,
					price: 0,
					size: 0
				}, {
					name: '华东',
					value: 5,
					price: 0,
					size: 0
				}, {
					name: '东北',
					value: 1,
					price: 0,
					size: 0
				}]
			]

			$scope.init3 = function() {
					myChart13.setOption({
						series: [{
							name: '出厂价',
							type: 'effectScatter',
							coordinateSystem: 'geo',
							data: convertData($scope.data.sort(function(a, b) {
								return a.size - b.size;
							})),
							symbolSize: function(val) {
								return val[3];
							},
							showEffectOn: 'render',
							rippleEffect: {
								brushType: 'stroke'
							},
							hoverAnimation: true,
							label: {
								normal: {
									formatter: '{b}',
									position: 'right',
									show: true,
									textStyle: {
										fontSize: '18',
										fontWetght: '400'
									}
								}
							},
							itemStyle: {
								normal: {
									color: '#ff9100',
									shadowBlur: 10,
									shadowColor: '#fce4ec'
								}
							},
							zlevel: 1
						}]
					});

					myChart14.setOption({
						//						visualMap: {
						//							show: false,
						//							min: 0,
						//							max: max,
						//							inRange: {
						//								symbolSize: [6, 45]
						//							}
						//						},

						series: [{
							type: 'effectScatter',
							coordinateSystem: 'geo',
							showEffectOn: 'render',
							rippleEffect: {
								brushType: 'stroke'
							},
							hoverAnimation: true,
							data: $scope.mapData.map(function(itemOpt) {
								return {
									name: itemOpt.name + ':' + itemOpt.price + itemOpt.nut,
									value: [
										latlong[itemOpt.code].longitude,
										latlong[itemOpt.code].latitude,
										itemOpt.value,
										itemOpt.size
									],
									label: {
										normal: {
											formatter: '{b}',
											position: 'right',
											show: true,
											textStyle: {
												fontSize: '18',
												fontWetght: '400'
											}
										}
									},
									itemStyle: {
										normal: {
											color: '#64dd17'
										}
									}
								};
							}),
							symbolSize: function(val) {
								return val[3];
							}
						}]
					});

				} //end init3

			$scope.data = [{
				name: '华北',
				value: 2,
				price: 0,
				size: 0
			}, {
				name: '西北',
				value: 7,
				price: 0,
				size: 0
			}, {
				name: '华东',
				value: 5,
				price: 0,
				size: 0
			}, {
				name: '华中',
				value: 4,
				price: 0,
				size: 0
			}, {
				name: '东北',
				value: 1,
				price: 0,
				size: 0
			}, {
				name: '华南',
				value: 3,
				price: 0,
				size: 0
			}, {
				name: '西南',
				value: 6,
				price: 0,
				size: 0
			}];

			var myChart13 = echarts.init(document.getElementById("price1"));

			var geoCoordMap = {
				'东北': [126.41, 45.45],
				'华北': [114.28, 38.04],
				'华南': [113.30, 23.20],
				'华东': [119.24, 33.43],
				'华中': [114.19, 30.35],
				'西北': [101.46, 36.37],
				'西南': [91.10, 29.41]

			};
			var convertData = function(data) {
				var res = [];
				var sizes = 20;
				for(var i = 0; i < data.length; i++) {
					var geoCoord = geoCoordMap[data[i].name];
					if(geoCoord) {
						if(i == 0) {
							res.push({
								name: data[i].name + ':' + data[i].price,
								value: geoCoord.concat([data[i].value, sizes])
							});
						} else {
							if(data[i].size == data[i - 1].size) {
								res.push({
									name: data[i].name + ':' + data[i].price,
									value: geoCoord.concat([data[i].value, sizes])
								});
							} else {
								sizes = sizes + 10;
								res.push({
									name: data[i].name + ':' + data[i].price,
									value: geoCoord.concat([data[i].value, sizes])
								});
							}
						}
					}
				}
				return res;
			};
			myChart13.setOption({
				backgroundColor: 'transparent',
				title: {
					text: '全国主要城市物料价格',
					subtext: '',
					sublink: 'http://www.pm25.in',
					left: 'center',
					top: '60px',
					textStyle: {
						color: '#fafafa'
					}
				},
				//				tooltip: {
				//					trigger: 'item'
				//				},
				legend: {
					orient: 'vertical',
					y: 'bottom',
					x: 'right',
					data: ['pm2.5'],
					textStyle: {
						color: '#fff'
					}
				},
				geo: {
					map: 'china',
					label: {
						emphasis: {
							show: false
						}
					},
					itemStyle: {
						normal: {
							areaColor: '#fff8e1',
							borderColor: '#ffb74d'
						},
						emphasis: {
							areaColor: '#ffecb3'
						}
					}
				},
				series: [{
					name: '出厂价',
					type: 'effectScatter',
					coordinateSystem: 'geo',
					data: convertData($scope.data.sort(function(a, b) {
						return a.size - b.size;
					})),
					symbolSize: function(val) {
						return val[3];
					},
					showEffectOn: 'render',
					rippleEffect: {
						brushType: 'stroke'
					},
					hoverAnimation: true,
					label: {
						normal: {
							formatter: '{b}',
							position: 'right',
							show: true,
							textStyle: {
								fontSize: '18',
								fontWetght: '400'
							}
						}
					},
					itemStyle: {
						normal: {
							color: '#ff9100',
							shadowBlur: 10,
							shadowColor: '#fce4ec'
						}
					},
					zlevel: 1
				}]
			});
			$scope.ano = '';
			$scope.iflist = 0;
			myChart13.on("click", function(params) {
				var t = window.localStorage.getItem('token');
				$scope.ano = params.value[2]
				if($scope.editc == 1) {
					$scope.trans = false;
					$scope.getprice($scope.cID, 24, 0, $scope.ano, t, $scope.selected, 0, 0, 0, 1, 0);
					document.getElementById('price1').style.display = "none";
					document.getElementById('p2').style.display = "block";
					$scope.iflist = 1;
				} else {
					alt('请选择物料')
				}
			});

			$scope.mapw = [
				[{
					'code': 'SA',
					'name': '东南亚',
					'value': 12653,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'NE',
					'name': '西北欧',
					'value': 13571,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'US',
					'name': '美国海湾',
					'value': 13573,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'NA',
					'name': '东北亚',
					'value': 12652,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'KR',
					'name': '韩国',
					'value': 12655,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}],
				[{
					'code': 'SA',
					'name': '东南亚',
					'value': 11411,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'IN',
					'name': '印度',
					'value': 11409,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}],
				[{
					'code': 'US',
					'name': '美国海湾',
					'value': 11430,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'KR',
					'name': '韩国',
					'value': 11375,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'RD',
					'name': '鹿特丹',
					'value': 11472,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'TW',
					'name': '台湾',
					'value': 11469,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}],
				[{
					'code': 'SA',
					'name': '东南亚',
					'value': 11345,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'CH',
					'name': '中国',
					'value': 11423,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'NE',
					'name': '西北欧',
					'value': 12724,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'US',
					'name': '美国海湾',
					'value': 11399,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}],
				[{
					'code': 'NE',
					'name': '西北欧',
					'value': 19541,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'MD',
					'name': '地中海',
					'value': 20143,
					'color': '#64ffda',
					'price': '',
					'size': 20,
					'nut': ''
				}]
			]

			var myChart14 = echarts.init(document.getElementById("price2"));
			var latlong = {};

			latlong.MD = {
				'latitude': 38.02,
				'longitude': 23.44
			};
			latlong.TW = {
				'latitude': 25.02,
				'longitude': 121.38
			};
			latlong.RD = {
				'latitude': 51.55,
				'longitude': 4.29
			};
			latlong.KR = {
				'latitude': 40.6,
				'longitude': 128.00
			};
			latlong.NA = {
				'latitude': 28.39,
				'longitude': 132.21
			};
			latlong.US = {
				'latitude': 29.58,
				'longitude': -90.05
			};
			latlong.NE = {
				'latitude': 60.30,
				'longitude': 10.45
			};
			latlong.CH = {
				'latitude': 43.54,
				'longitude': 116.23
			};
			latlong.IN = {
				'latitude': 28.37,
				'longitude': 77.13
			};
			latlong.SA = {
				'latitude': 14.01,
				'longitude': 103.48
			};

			$scope.mapData = [

				{
					'code': 'SA',
					'name': '东南亚',
					'value': 11411,
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'IN',
					'name': '印度',
					'value': 11409,
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'CH',
					'name': '中国',
					'value': 11423,
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'NE',
					'name': '西北欧',
					'value': 12724,
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'US',
					'name': '美国海湾',
					'value': 11399,
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'NA',
					'name': '东北亚',
					'value': 12652,
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'KR',
					'name': '韩国',
					'value': 12655,
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'RD',
					'name': '鹿特丹',
					'value': 11472,
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'TW',
					'name': '台湾',
					'value': 11469,
					'price': '',
					'size': 20,
					'nut': ''
				}, {
					'code': 'MD',
					'name': '地中海',
					'value': 20143,
					'price': '',
					'size': 20,
					'nut': ''
				}
			];

			var max = -Infinity;
			var min = Infinity;
			//			$scope.mapData.forEach(function(itemOpt) {
			//				if(itemOpt.value > max) {
			//					max = itemOpt.price;
			//				}
			//				if(itemOpt.value < min) {
			//					min = itemOpt.price;
			//				}
			//			});

			myChart14.setOption({
				backgroundColor: '#transparent',
				title: {
					text: '国际物料价格',
					subtext: '',
					left: 'center',
					top: '60px',
					textStyle: {
						color: '#fafafa'
					}
				},
				//				tooltip: {
				//					trigger: 'item',
				//					formatter: function(params) {
				//						//						console.dir(params);
				//						var value = (params.value + '').split('.');
				//						value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') +
				//							'.' + value[1];
				//						return params.seriesName + '<br/>' + params.name + ' : ' + value;
				//					}
				//				},
				//				visualMap: {
				//					show: false,
				//					min: 0,
				//					max: max,
				//					inRange: {
				//						
				//						
				//					}
				//				},
				geo: {
					name: 'World Population (2010)',
					type: 'map',
					map: 'world',
					label: {
						emphasis: {
							show: false
						}
					},
					itemStyle: {
						normal: {
							areaColor: '#f9fbe7',
							borderColor: '#dce775'
						},
						emphasis: {
							areaColor: '#e6ee9c'
						}
					}
				},
				series: [{
					type: 'scatter',
					coordinateSystem: 'geo',
					data: $scope.mapData.map(function(itemOpt) {
						return {
							name: itemOpt.name + ':' + itemOpt.price + itemOpt.nut,
							value: [
								latlong[itemOpt.code].longitude,
								latlong[itemOpt.code].latitude,
								itemOpt.value,
								itemOpt.size
							],
							label: {
								normal: {
									formatter: '{b}',
									position: 'right',
									show: true,
									textStyle: {
										fontSize: '18',
										fontWetght: '400'
									}
								}
							},
							itemStyle: {
								normal: {
									color: '#ff9100'

								}
							}
						};
					}),
					symbolSize: function(val) {
						return val[3];
					}
				}]
			});

			//清空数据
			$scope.cle1 = function(params) {
				$scope.week2 = [];
				$scope.weekdata2 = [];
				$scope.week2j = [];
				$scope.weekdata2j = [];
				$scope.week2b = [];
				$scope.weekdata2b = [];
				$scope.week2n = [];
				$scope.weekdata2n = [];
				var name = params.name.split(':')
				$scope.tit7 = '';
				$scope.tit7 = name[0];
				$scope.init4($scope.week2, $scope.weekdata2, 2);
			}

			myChart14.on("click", function(params) {
				$scope.cle1(params);
				var t = window.localStorage.getItem('token');
				var mno = params.value[2]
				if($scope.editc == 1) {
					$scope.trans = false;
					$scope.getprice($scope.cID, 26, mno, 0, t, $scope.selected, 0, 0, 0, 3, 30);
					$scope.getprice($scope.cID, 26, mno, 0, t, $scope.selected, 0, 0, 0, 3, 90);
					$scope.getprice($scope.cID, 26, mno, 0, t, $scope.selected, 0, 0, 0, 3, 180);
					$scope.getprice($scope.cID, 26, mno, 0, t, $scope.selected, 0, 0, 0, 3, 360);
					document.getElementById('price2').style.display = "none";
					document.getElementById('ptab2').style.display = "block";
					document.getElementById('text').style.display = "none";
					document.getElementById('a44').style.display = "block";
					document.getElementById('a55').style.display = "block";
					document.getElementById('a66').style.display = "block";
					document.getElementById('a77').style.display = "block";
					document.getElementById('a44').style.backgroundColor = "#ffe0b2";
					document.getElementById('a55').style.backgroundColor = "transparent";
					document.getElementById('a66').style.backgroundColor = "transparent";
					document.getElementById('a77').style.backgroundColor = "transparent";

				} else {
					alt('请选择物料')
				}

			});

			$scope.week = [];
			$scope.weekdata = [];
			$scope.weekj = [];
			$scope.weekdataj = [];
			$scope.weekb = [];
			$scope.weekdatab = [];
			$scope.weekn = [];
			$scope.weekdatan = [];

			$scope.week2 = [];
			$scope.weekdata2 = [];
			$scope.week2j = [];
			$scope.weekdata2j = [];
			$scope.week2b = [];
			$scope.weekdata2b = [];
			$scope.week2n = [];
			$scope.weekdata2n = [];

			$scope.week3 = [];
			$scope.weekdata3 = [];
			$scope.week3j = [];
			$scope.weekdata3j = [];
			$scope.week3b = [];
			$scope.weekdata3b = [];
			$scope.week3n = [];
			$scope.weekdata3n = [];

			$scope.init4 = function(xdata, ydata, id) {
				switch(id) {
					case 1:
						myChart15.setOption({
							title: {
								text: $scope.tit7 + '价格一览',
								left: 'center',
								top: '-2',
								textStyle: {
									color: '#ffe0b2',
									fontSize: '20'
								}
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: xdata, //$scope.week, //['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
								axisLabel: {
									textStyle: {
										color: '#ffe0b2'
									}
								},
								nameTextStyle: {
									color: '#ffffff'
								}
							},
							yAxis: {
								type: 'value',
								axisLabel: {
									textStyle: {
										color: '#ffe0b2'
									}
								}
							},
							series: [{
								name: '价格一览',
								type: 'line',
								stack: '总量',
								data: ydata, //$scope.weekdata, //[120, 132, 101, 134, 90, 230, 210]
								markLine: {
									data: [{
										type: 'average',
										name: '平均值'
									}]
								}
							}]
						});
						break;
					case 2:
						myChart16.setOption({
							title: {
								text: $scope.tit7 + '价格一览',
								left: 'center',
								top: '-2',
								textStyle: {
									color: '#ffe0b2',
									fontSize: '20'
								}
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: xdata, //$scope.week2, //['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
								axisLabel: {
									textStyle: {
										color: '#ffe0b2'
									}
								},
								nameTextStyle: {
									color: '#ffffff'
								}
							},
							yAxis: {
								type: 'value',
								axisLabel: {
									textStyle: {
										color: '#ffe0b2'
									}
								}
							},
							series: [{
								name: '价格一览',
								type: 'line',
								stack: '总量',
								data: ydata, //$scope.weekdata2, //[120, 132, 101, 134, 90, 230, 210]
								markLine: {
									data: [{
										type: 'average',
										name: '平均值'
									}]
								}
							}]
						});
						break;
					case 3:
						myChart17.setOption({
							title: {
								text: $scope.tit7 + '价格一览',
								left: 'center',
								top: '-2',
								textStyle: {
									color: '#ffe0b2',
									fontSize: '20'
								}
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: xdata, //$scope.week3, //['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
								axisLabel: {
									textStyle: {
										color: '#ffe0b2'
									}
								},
								nameTextStyle: {
									color: '#ffffff'
								}
							},
							yAxis: {
								type: 'value',
								axisLabel: {
									textStyle: {
										color: '#ffe0b2'
									}
								}
							},
							series: [{
								name: '价格一览',
								type: 'line',
								stack: '总量',
								data: ydata, //$scope.weekdata3, //[120, 132, 101, 134, 90, 230, 210]
								markLine: {
									data: [{
										type: 'average',
										name: '平均值'
									}]
								}
							}]
						});
						break;
					default:
						break;
				}

			}

			var myChart15 = echarts.init(document.getElementById("p1"));
			myChart15.setOption({
				title: {
					text: '价格一览',
					left: 'center',
					top: '-2',
					textStyle: {
						color: '#ffe0b2',
						fontSize: '20'
					}
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},

				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: $scope.week, //['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
					axisLabel: {
						textStyle: {
							color: '#ffe0b2'
						}
					},
					nameTextStyle: {
						color: '#ffffff'
					}
				},
				yAxis: {
					type: 'value',
					scale: true,
					axisLabel: {
						textStyle: {
							color: '#ffe0b2'
						}
					}
				},
				series: [{
					name: '价格一览',
					type: 'line',
					stack: '总量',
					label: {
						normal: {
							show: true,
							textStyle: {
								fontSize: 18,
								color: '#f06292'
							}
							//							 position: 'top'
						}
					},
					data: $scope.weekdata, //[120, 132, 101, 134, 90, 230, 210]
					markLine: {
						data: [{
							type: 'average',
							name: '平均值'
						}]
					}
				}]
			});
			var myChart16 = echarts.init(document.getElementById("ptab0"));
			myChart16.setOption({
				title: {
					text: '价格一览',
					left: 'center',
					top: '-2',
					textStyle: {
						color: '#ffe0b2',
						fontSize: '20'
					}
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},

				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},

				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: $scope.week2, //['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
					axisLabel: {
						textStyle: {
							color: '#ffe0b2'
						}
					},
					nameTextStyle: {
						color: '#ffffff'
					}
				},
				yAxis: {
					type: 'value',
					scale: true,
					axisLabel: {
						textStyle: {
							color: '#ffe0b2'
						}
					}
				},
				series: [{
					name: '价格一览',
					type: 'line',
					stack: '总量',
					label: {
						normal: {
							show: true,
							textStyle: {
								fontSize: 18,
								color: '#f06292'
							}
							//							 position: 'top'
						}
					},
					data: $scope.weekdata2, //[120, 132, 101, 134, 90, 230, 210]
					markLine: {
						data: [{
							type: 'average',
							name: '平均值'
						}]
					}
				}]
			});
			var myChart17 = echarts.init(document.getElementById("ptab3"));
			myChart17.setOption({
				title: {
					text: '价格一览',
					left: 'center',
					top: '-2',
					textStyle: {
						color: '#ffe0b2',
						fontSize: '20'
					}
				},
				legend: {
					width: '300'
				},
				tooltip: {
					trigger: 'axis',
					hideDelay: 50,

					textStyle: {
						fontSize: 22,
						fontWeight: '600'
					}
				},
				grid: {
					left: '3%',
					right: '10%',
					bottom: '3%',
					containLabel: true
				},
				//				toolbox: {
				//					feature: {
				//						saveAsImage: {}
				//					}
				//				},
				xAxis: {

					type: 'category',
					boundaryGap: false,
					data: $scope.week3, //['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
					axisLabel: {
						textStyle: {
							color: '#ffe0b2'
						}
					},
					nameTextStyle: {
						color: '#ffffff'
					}

				},
				yAxis: {
					type: 'value',
					scale: true,
					axisLabel: {
						textStyle: {
							color: '#ffe0b2'
						}
					}
				},
				series: [{
					name: '价格一览',
					type: 'line',
					stack: '总量',
					label: {
						normal: {
							show: true,
							textStyle: {
								fontSize: 18,
								color: '#f06292'
							}
							//							 position: 'top'
						}
					},
					data: $scope.weekdata3, //[120, 132, 101, 134, 90, 230, 210]
					markLine: {
						data: [{
							type: 'average',
							name: '平均值'
						}]
					}
				}]
			});

			//$scope.init();
			$scope.back = function() {
				$scope.change = false;
				$scope.check();
				if($scope.timechange) {
					$scope.ref();
				} else {
					$scope.ifopt();
					console.log('时间未改变');
				}
				$scope.timechange = false;
				document.getElementById('d1').style.display = "none";
				document.getElementById('d4').style.display = "none";
				document.getElementById('0').style.display = "block";
				document.getElementById('q').style.display = "none";
				$scope.iid = undefined;
			}
			$scope.back2 = function() {
				$scope.change = false;
				$scope.check();
				$scope.iflist = 0;
				if($scope.timechange) {
					$scope.ref();
				} else {
					$scope.ifopt();
					console.log('时间未改变');
				}
				$scope.timechange = false;
				document.getElementById('d2').style.display = "none";
				document.getElementById('q').style.display = "none";
				document.getElementById('d5').style.display = "none";

				document.getElementById('0').style.display = "block";
			}

			$scope.back3 = function() {
				$scope.change = false;
				$scope.check();
				if($scope.timechange) {
					$scope.ref();
				} else {
					$scope.ifopt();
					console.log('时间未改变');
				}
				$scope.timechange = false;
				document.getElementById('d2').style.display = "none";
				document.getElementById('de5').style.display = "none";
				document.getElementById('0').style.display = "block";
				document.getElementById('q').style.display = "none";
			}
			$scope.back4 = function() {

				document.getElementById('d2').style.display = "none";
				document.getElementById('de6').style.display = "none";
				document.getElementById('de7').style.display = "none";
				document.getElementById('de8').style.display = "none";
				
				
				document.getElementById('0').style.display = "block";
				document.getElementById('q').style.display = "none";
			}

			$scope.clear2 = function() {
				document.getElementById('d2').style.display = "none";
				document.getElementById('d5').style.display = "none";
				document.getElementById('d3').style.display = "block";
				document.getElementById('dd2').style.display = "none";
				document.getElementById('date').style.display = "block";
				document.getElementById('de5').style.display = "none";
				document.getElementById('de2').style.display = "none";
			}

			$scope.clear1 = function() {
				document.getElementById('d1').style.display = "none";
				document.getElementById('d4').style.display = "none";
				document.getElementById('d0').style.display = "block";
				document.getElementById('dd1').style.display = "none";
				document.getElementById('date').style.display = "block";
				//				document.getElementById('ref').style.display = 'block';
			}

			//display

			$scope.table1 = function() {
				document.getElementById('d13').style.display = "none";
				document.getElementById('d12').style.display = "block";
				document.getElementById('d121').style.display = "block";

				document.getElementById('d132').style.display = "none";
				document.getElementById('d122').style.display = "block";
				document.getElementById('ds122').style.display = "none";
				document.getElementById('ds132').style.display = "none";

				document.getElementById('de132').style.display = "none";
				document.getElementById('des132').style.display = "none";
				document.getElementById('des122').style.display = "none";
				document.getElementById('de122').style.display = "block";

				document.getElementById('tab1').style.backgroundColor = "#0059BC";
				document.getElementById('tab2').style.backgroundColor = "#6ba4fa";

				document.getElementById('tt1').style.backgroundColor = "#0059BC";
				document.getElementById('tt2').style.backgroundColor = "#6ba4fa";
				document.getElementById('tt3').style.backgroundColor = "#6ba4fa";
				document.getElementById('tt4').style.backgroundColor = "#6ba4fa";

				document.getElementById('t1').style.backgroundColor = "#0059BC";
				document.getElementById('t2').style.backgroundColor = "#6ba4fa";
				document.getElementById('t3').style.backgroundColor = "#6ba4fa";
				document.getElementById('t4').style.backgroundColor = "#6ba4fa";
			}

			$scope.table2 = function() {
				document.getElementById('d12').style.display = "none";
				document.getElementById('d13').style.display = "block";

				document.getElementById('d122').style.display = "none";
				document.getElementById('d132').style.display = "block";
				document.getElementById('ds122').style.display = "none";
				document.getElementById('ds132').style.display = "none";

				document.getElementById('de122').style.display = "none";
				document.getElementById('de132').style.display = "block";
				document.getElementById('des132').style.display = "none";
				document.getElementById('des122').style.display = "none";

				document.getElementById('tab2').style.backgroundColor = "#0059BC";
				document.getElementById('tab1').style.backgroundColor = "#6ba4fa";

				document.getElementById('tt2').style.backgroundColor = "#0059BC";
				document.getElementById('tt1').style.backgroundColor = "#6ba4fa";
				document.getElementById('tt3').style.backgroundColor = "#6ba4fa";
				document.getElementById('tt4').style.backgroundColor = "#6ba4fa";

				document.getElementById('t2').style.backgroundColor = "#0059BC";
				document.getElementById('t1').style.backgroundColor = "#6ba4fa";
				document.getElementById('t3').style.backgroundColor = "#6ba4fa";
				document.getElementById('t4').style.backgroundColor = "#6ba4fa";

			}

			$scope.table3 = function() {
				document.getElementById('d13').style.display = "none";
				document.getElementById('d12').style.display = "block";
				document.getElementById('d121').style.display = "block";

				document.getElementById('ds132').style.display = "none";
				document.getElementById('ds122').style.display = "block";
				document.getElementById('d122').style.display = "none";
				document.getElementById('d132').style.display = "none";

				document.getElementById('de122').style.display = "none";
				document.getElementById('de132').style.display = "none";
				document.getElementById('des132').style.display = "none";
				document.getElementById('des122').style.display = "block";

				document.getElementById('tt3').style.backgroundColor = "#0059BC";
				document.getElementById('tt2').style.backgroundColor = "#6ba4fa";
				document.getElementById('tt1').style.backgroundColor = "#6ba4fa";
				document.getElementById('tt4').style.backgroundColor = "#6ba4fa";

				document.getElementById('t3').style.backgroundColor = "#0059BC";
				document.getElementById('t2').style.backgroundColor = "#6ba4fa";
				document.getElementById('t1').style.backgroundColor = "#6ba4fa";
				document.getElementById('t4').style.backgroundColor = "#6ba4fa";
			}

			$scope.table4 = function() {
				document.getElementById('d12').style.display = "none";
				document.getElementById('d13').style.display = "block";

				document.getElementById('ds122').style.display = "none";
				document.getElementById('ds132').style.display = "block";
				document.getElementById('d122').style.display = "none";
				document.getElementById('d132').style.display = "none";

				document.getElementById('de122').style.display = "none";
				document.getElementById('de132').style.display = "none";
				document.getElementById('des132').style.display = "block";
				document.getElementById('des122').style.display = "none";

				document.getElementById('tt4').style.backgroundColor = "#0059BC";
				document.getElementById('tt2').style.backgroundColor = "#6ba4fa";
				document.getElementById('tt3').style.backgroundColor = "#6ba4fa";
				document.getElementById('tt1').style.backgroundColor = "#6ba4fa";

				document.getElementById('t4').style.backgroundColor = "#0059BC";
				document.getElementById('t2').style.backgroundColor = "#6ba4fa";
				document.getElementById('t3').style.backgroundColor = "#6ba4fa";
				document.getElementById('t1').style.backgroundColor = "#6ba4fa";
			}

			$scope.table10 = function() {
				$scope.pricetype = 3;
				$scope.iflist = 0;
				document.getElementById('a3').style.backgroundColor = "transparent";
				document.getElementById('a2').style.backgroundColor = "transparent";
				document.getElementById('a1').style.backgroundColor = "transparent";
				document.getElementById('a4').style.backgroundColor = "transparent";
				document.getElementById('a5').style.backgroundColor = "transparent";
				document.getElementById('a6').style.backgroundColor = "#1a237e";

				document.getElementById('a3').style.color = "#ffccbc";
				document.getElementById('a5').style.color = "#ffccbc";
				document.getElementById('a2').style.color = "#ffccbc";
				document.getElementById('a1').style.color = "#ffccbc";
				document.getElementById('a4').style.color = "#ffccbc";
				document.getElementById('a6').style.color = "#ffffff";

				document.getElementById('a11').style.display = "none";
				document.getElementById('a22').style.display = "none";
				document.getElementById('a33').style.display = "block";
				document.getElementById('a33').style.backgroundColor = "#303f9f";
				document.getElementById('a33').style.color = "#ffffff";

				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";

				document.getElementById('price2').style.display = "none";
				document.getElementById('price1').style.display = "none";
				document.getElementById('ptab1').style.display = "none";
				document.getElementById('ptab2').style.display = "none";
				document.getElementById('ptab').style.display = "none";
				document.getElementById('p2').style.display = "none";
				document.getElementById('p3').style.display = "block";

				$scope.cID = '200';
				$scope.editc = 1;

				$scope.marketprc = [];
				var t = window.localStorage.getItem('token');
				$scope.getprice($scope.cID, 25, 0, 0, t, $scope.selected, 0, 0, 0, 4, 0);

			}

			$scope.table11 = function() {
				$scope.pricetype = 1;
				$scope.iflist = 0;
				document.getElementById('a1').style.backgroundColor = "#1a237e";
				document.getElementById('a2').style.backgroundColor = "transparent";
				document.getElementById('a3').style.backgroundColor = "transparent";
				document.getElementById('a4').style.backgroundColor = "transparent";
				document.getElementById('a5').style.backgroundColor = "transparent";
				document.getElementById('a6').style.backgroundColor = "transparent";

				document.getElementById('a6').style.color = "#ffccbc";
				document.getElementById('a1').style.color = "#ffffff";
				document.getElementById('a5').style.color = "#ffccbc";
				document.getElementById('a2').style.color = "#ffccbc";
				document.getElementById('a3').style.color = "#ffccbc";
				document.getElementById('a4').style.color = "#ffccbc";

				document.getElementById('a11').style.display = "block";
				document.getElementById('a22').style.display = "none";
				document.getElementById('a33').style.display = "none";
				document.getElementById('a11').style.backgroundColor = "#303f9f";
				document.getElementById('a11').style.color = "#ffffff";

				document.getElementById('price2').style.display = "block";
				document.getElementById('price1').style.display = "none";
				document.getElementById('p3').style.display = "none";
				document.getElementById('p2').style.display = "none";
				document.getElementById('ptab2').style.display = "none";
				document.getElementById('ptab1').style.display = "none";
				document.getElementById('ptab').style.display = "none";
				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";

				$scope.cID = '317';
				$scope.editc = 1;
				$scope.data = $scope.mapc[0];
				//获取该物料各地区国际价
				$scope.mapData = $scope.mapw[0];
				var t = window.localStorage.getItem('token');
				$scope.getprice($scope.cID, 26, 0, 0, t, $scope.selected, 0, 0, 0, 7, 0);

			}

			$scope.table12 = function() {
				$scope.iflist = 0;
				document.getElementById('a2').style.backgroundColor = "#1a237e";
				document.getElementById('a1').style.backgroundColor = "transparent";
				document.getElementById('a3').style.backgroundColor = "transparent";
				document.getElementById('a4').style.backgroundColor = "transparent";
				document.getElementById('a5').style.backgroundColor = "transparent";
				document.getElementById('a6').style.backgroundColor = "transparent";

				document.getElementById('a6').style.color = "#ffccbc";
				document.getElementById('a2').style.color = "#ffffff";
				document.getElementById('a5').style.color = "#ffccbc";
				document.getElementById('a1').style.color = "#ffccbc";
				document.getElementById('a3').style.color = "#ffccbc";
				document.getElementById('a4').style.color = "#ffccbc";

				document.getElementById('a11').style.display = "block";
				document.getElementById('a22').style.display = "block";
				document.getElementById('a33').style.display = "block";
				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";
				$scope.cID = '332';
				$scope.editc = 1;
				//获取该物料各地区出厂价
				$scope.data = $scope.mapc[1];
				var t = window.localStorage.getItem('token');
				$scope.getprice($scope.cID, 24, 0, 0, t, $scope.selected, 0, 0, 0, 6, 0);
				//获取该物料各地区国际价
				$scope.mapData = $scope.mapw[1];
				$scope.getprice($scope.cID, 26, 0, 0, t, $scope.selected, 0, 0, 0, 7, 0);

				//				if($scope.pricetype == 3){
				//					var t = $scope.selected.split('-');
				//					$scope.ry = t[0];
				//					$scope.rm = t[1];
				//					$scope.rd = t[2];
				//					var t = window.localStorage.getItem('token');
				//					$scope.getprice($scope.cID, 25, '', '', t, '', $scope.ry, $scope.rm, $scope.rd, 4);
				//				}

				switch($scope.pricetype) {
					case 1:
						document.getElementById('a22').style.backgroundColor = "#transparent";
						document.getElementById('a22').style.color = "#fff8e1";
						document.getElementById('a11').style.color = "#ffffff";
						document.getElementById('a33').style.color = "#fff8e1";
						document.getElementById('a11').style.backgroundColor = "#303f9f";
						document.getElementById('a33').style.backgroundColor = "transparent";
						document.getElementById('price1').style.display = "none";
						document.getElementById('price2').style.display = "block";
						document.getElementById('p3').style.display = "none";
						document.getElementById('p2').style.display = "none";
						document.getElementById('ptab2').style.display = "none";
						document.getElementById('ptab1').style.display = "none";
						document.getElementById('ptab').style.display = "none";
						break;
					case 2:
						document.getElementById('a22').style.backgroundColor = "#303f9f";
						document.getElementById('a22').style.color = "#ffffff";
						document.getElementById('a11').style.color = "#fff8e1";
						document.getElementById('a33').style.color = "#fff8e1";
						document.getElementById('a11').style.backgroundColor = "transparent";
						document.getElementById('a33').style.backgroundColor = "transparent";
						document.getElementById('price1').style.display = "block";
						document.getElementById('price2').style.display = "none";
						document.getElementById('p3').style.display = "none";
						document.getElementById('p2').style.display = "none";
						document.getElementById('ptab2').style.display = "none";
						document.getElementById('ptab1').style.display = "none";
						document.getElementById('ptab').style.display = "none";
						break;
					case 3:
						//获取市场价
						$scope.marketprc = [];
						var t = window.localStorage.getItem('token');
						$scope.getprice($scope.cID, 25, 0, 0, t, $scope.selected, 0, 0, 0, 4, 0);

						document.getElementById('a22').style.backgroundColor = "transparent";
						document.getElementById('a22').style.color = "#fff8e1";
						document.getElementById('a11').style.color = "#fff8e1";
						document.getElementById('a33').style.color = "#ffffff";
						document.getElementById('a11').style.backgroundColor = "transparent";
						document.getElementById('a33').style.backgroundColor = "#303f9f";
						document.getElementById('price1').style.display = "none";
						document.getElementById('price2').style.display = "none";
						document.getElementById('p3').style.display = "block";
						document.getElementById('p2').style.display = "none";
						document.getElementById('ptab2').style.display = "none";
						document.getElementById('ptab1').style.display = "none";
						document.getElementById('ptab').style.display = "none";
						break;
					default:
						break;
				}

			}

			$scope.table13 = function() {
				$scope.iflist = 0;
				document.getElementById('a3').style.backgroundColor = "#1a237e";
				document.getElementById('a2').style.backgroundColor = "transparent";
				document.getElementById('a1').style.backgroundColor = "transparent";
				document.getElementById('a4').style.backgroundColor = "transparent";
				document.getElementById('a5').style.backgroundColor = "transparent";
				document.getElementById('a6').style.backgroundColor = "transparent";
				document.getElementById('a6').style.color = "#ffccbc";
				document.getElementById('a3').style.color = "#ffffff";
				document.getElementById('a5').style.color = "#ffccbc";
				document.getElementById('a2').style.color = "#ffccbc";
				document.getElementById('a1').style.color = "#ffccbc";
				document.getElementById('a4').style.color = "#ffccbc";
				document.getElementById('a11').style.display = "block";
				document.getElementById('a22').style.display = "block";
				document.getElementById('a33').style.display = "block";
				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";

				$scope.cID = '461';
				$scope.editc = 1;

				//获取该物料各地区出厂价
				$scope.data = $scope.mapc[2];
				var t = window.localStorage.getItem('token');
				$scope.getprice($scope.cID, 24, 0, 0, t, $scope.selected, 0, 0, 0, 6, 0);

				//获取该物料各地区国际价
				$scope.mapData = $scope.mapw[2];
				$scope.getprice($scope.cID, 26, 0, 0, t, $scope.selected, 0, 0, 0, 7, 0);

				switch($scope.pricetype) {
					case 1:
						document.getElementById('a22').style.backgroundColor = "transparent";
						document.getElementById('a22').style.color = "#fff8e1";
						document.getElementById('a11').style.color = "#ffffff";
						document.getElementById('a33').style.color = "#fff8e1";
						document.getElementById('a11').style.backgroundColor = "#303f9f";
						document.getElementById('a33').style.backgroundColor = "transparent";
						document.getElementById('price1').style.display = "none";
						document.getElementById('price2').style.display = "block";
						document.getElementById('p3').style.display = "none";
						document.getElementById('p2').style.display = "none";
						document.getElementById('ptab2').style.display = "none";
						document.getElementById('ptab1').style.display = "none";
						document.getElementById('ptab').style.display = "none";
						break;
					case 2:
						document.getElementById('a22').style.backgroundColor = "#303f9f";
						document.getElementById('a22').style.color = "#ffffff";
						document.getElementById('a11').style.color = "#fff8e1";
						document.getElementById('a33').style.color = "#fff8e1";
						document.getElementById('a11').style.backgroundColor = "transparent";
						document.getElementById('a33').style.backgroundColor = "transparent";
						document.getElementById('price1').style.display = "block";
						document.getElementById('price2').style.display = "none";
						document.getElementById('p3').style.display = "none";
						document.getElementById('p2').style.display = "none";
						document.getElementById('ptab2').style.display = "none";
						document.getElementById('ptab1').style.display = "none";
						document.getElementById('ptab').style.display = "none";
						break;
					case 3:
						//获取市场价
						$scope.marketprc = [];
						var t = window.localStorage.getItem('token');
						$scope.getprice($scope.cID, 25, 0, 0, t, $scope.selected, 0, 0, 0, 4, 0);

						document.getElementById('a22').style.backgroundColor = "transparent";
						document.getElementById('a22').style.color = "#fff8e1";
						document.getElementById('a11').style.color = "#fff8e1";
						document.getElementById('a33').style.color = "#ffffff";
						document.getElementById('a11').style.backgroundColor = "transparent";
						document.getElementById('a33').style.backgroundColor = "#303f9f";
						document.getElementById('price1').style.display = "none";
						document.getElementById('price2').style.display = "none";
						document.getElementById('p3').style.display = "block";
						document.getElementById('p2').style.display = "none";
						document.getElementById('ptab2').style.display = "none";
						document.getElementById('ptab1').style.display = "none";
						document.getElementById('ptab').style.display = "none";
						break;
					default:
						break;
				}

			}

			$scope.table14 = function() {
				$scope.iflist = 0;
				document.getElementById('a4').style.backgroundColor = "#1a237e";
				document.getElementById('a2').style.backgroundColor = "transparent";
				document.getElementById('a3').style.backgroundColor = "transparent";
				document.getElementById('a1').style.backgroundColor = "transparent";
				document.getElementById('a5').style.backgroundColor = "transparent";
				document.getElementById('a6').style.backgroundColor = "transparent";
				document.getElementById('a6').style.color = "#ffccbc";
				document.getElementById('a4').style.color = "#ffffff";
				document.getElementById('a5').style.color = "#ffccbc";
				document.getElementById('a2').style.color = "#ffccbc";
				document.getElementById('a3').style.color = "#ffccbc";
				document.getElementById('a1').style.color = "#ffccbc";
				document.getElementById('a11').style.display = "block";
				document.getElementById('a22').style.display = "block";
				document.getElementById('a33').style.display = "block";
				document.getElementById('text').style.display = "block";
				document.getElementById('a44').style.display = "none";
				document.getElementById('a55').style.display = "none";
				document.getElementById('a66').style.display = "none";
				document.getElementById('a77').style.display = "none";

				$scope.cID = '340';
				$scope.editc = 1;

				//获取该物料各地区出厂价
				$scope.data = $scope.mapc[3];
				var t = window.localStorage.getItem('token');
				$scope.getprice($scope.cID, 24, 0, 0, t, $scope.selected, 0, 0, 0, 6, 0);

				//获取该物料各地区国际价
				$scope.mapData = $scope.mapw[3];
				$scope.getprice($scope.cID, 26, 0, 0, t, $scope.selected, 0, 0, 0, 7, 0);

				switch($scope.pricetype) {
					case 1:
						document.getElementById('a22').style.backgroundColor = "transparent";
						document.getElementById('a22').style.color = "#fff8e1";
						document.getElementById('a11').style.color = "#ffffff";
						document.getElementById('a33').style.color = "#fff8e1";
						document.getElementById('a11').style.backgroundColor = "#303f9f";
						document.getElementById('a33').style.backgroundColor = "transparent";
						document.getElementById('price1').style.display = "none";
						document.getElementById('price2').style.display = "block";
						document.getElementById('p3').style.display = "none";
						document.getElementById('p2').style.display = "none";
						document.getElementById('ptab2').style.display = "none";
						document.getElementById('ptab1').style.display = "none";
						document.getElementById('ptab').style.display = "none";
						break;
					case 2:
						document.getElementById('a22').style.backgroundColor = "#303f9f";
						document.getElementById('a22').style.color = "#ffffff";
						document.getElementById('a11').style.color = "#fff8e1";
						document.getElementById('a33').style.color = "#fff8e1";
						document.getElementById('a11').style.backgroundColor = "transparent";
						document.getElementById('a33').style.backgroundColor = "transparent";
						document.getElementById('price1').style.display = "block";
						document.getElementById('price2').style.display = "none";
						document.getElementById('p3').style.display = "none";
						document.getElementById('p2').style.display = "none";
						document.getElementById('ptab2').style.display = "none";
						document.getElementById('ptab1').style.display = "none";
						document.getElementById('ptab').style.display = "none";
						break;
					case 3:
						//获取市场价
						$scope.marketprc = [];
						var t = window.localStorage.getItem('token');
						$scope.getprice($scope.cID, 25, 0, 0, t, $scope.selected, 0, 0, 0, 4, 0);

						document.getElementById('a22').style.backgroundColor = "transparent";
						document.getElementById('a22').style.color = "#fff8e1";
						document.getElementById('a11').style.color = "#fff8e1";
						document.getElementById('a33').style.color = "#ffffff";
						document.getElementById('a11').style.backgroundColor = "transparent";
						document.getElementById('a33').style.backgroundColor = "#303f9f";
						document.getElementById('price1').style.display = "none";
						document.getElementById('price2').style.display = "none";
						document.getElementById('p3').style.display = "block";
						document.getElementById('p2').style.display = "none";
						document.getElementById('ptab2').style.display = "none";
						document.getElementById('ptab1').style.display = "none";
						document.getElementById('ptab').style.display = "none";
						break;
					default:
						break;
				}

			}

			$scope.table15 = function() {
					$scope.pricetype = 2;
					$scope.iflist = 0;
					document.getElementById('a5').style.backgroundColor = "#1a237e";
					document.getElementById('a2').style.backgroundColor = "transparent";
					document.getElementById('a3').style.backgroundColor = "transparent";
					document.getElementById('a4').style.backgroundColor = "transparent";
					document.getElementById('a1').style.backgroundColor = "transparent";
					document.getElementById('a6').style.backgroundColor = "transparent";
					document.getElementById('a6').style.color = "#ffccbc";
					document.getElementById('a5').style.color = "#ffffff";
					document.getElementById('a1').style.color = "#ffccbc";
					document.getElementById('a2').style.color = "#ffccbc";
					document.getElementById('a3').style.color = "#ffccbc";
					document.getElementById('a4').style.color = "#ffccbc";

					document.getElementById('a11').style.display = "block";
					document.getElementById('a22').style.display = "block";
					document.getElementById('a33').style.display = "none";
					document.getElementById('a22').style.backgroundColor = "#303f9f";
					document.getElementById('a22').style.color = "#ffffff";
					document.getElementById('a11').style.color = "#fff8e1";
					document.getElementById('a33').style.color = "#fff8e1";
					document.getElementById('a11').style.backgroundColor = "transparent";
					document.getElementById('a33').style.backgroundColor = "transparent";
					document.getElementById('text').style.display = "block";
					document.getElementById('a44').style.display = "none";
					document.getElementById('a55').style.display = "none";
					document.getElementById('a66').style.display = "none";
					document.getElementById('a77').style.display = "none";

					$scope.cID = '375';
					$scope.editc = 1;

					//获取该物料各地区出厂价
					$scope.data = $scope.mapc[4];
					var t = window.localStorage.getItem('token');
					$scope.getprice($scope.cID, 24, 0, 0, t, $scope.selected, 0, 0, 0, 6, 0);
					//获取该物料各地区国际价
					$scope.mapData = $scope.mapw[4];
					$scope.getprice($scope.cID, 26, 0, 0, t, $scope.selected, 0, 0, 0, 7, 0);

					switch($scope.pricetype) {
						case 1:
							document.getElementById('a22').style.backgroundColor = "transparent";
							document.getElementById('a22').style.color = "#fff8e1";
							document.getElementById('a11').style.color = "#ffffff";
							document.getElementById('a33').style.color = "#fff8e1";
							document.getElementById('a11').style.backgroundColor = "#303f9f";
							document.getElementById('a33').style.backgroundColor = "transparent";
							document.getElementById('price1').style.display = "none";
							document.getElementById('price2').style.display = "block";
							document.getElementById('p3').style.display = "none";
							document.getElementById('p2').style.display = "none";
							document.getElementById('ptab2').style.display = "none";
							document.getElementById('ptab1').style.display = "none";
							document.getElementById('ptab').style.display = "none";
							break;
						case 2:
							document.getElementById('a22').style.backgroundColor = "#303f9f";
							document.getElementById('a22').style.color = "#ffffff";
							document.getElementById('a11').style.color = "#fff8e1";
							document.getElementById('a33').style.color = "#fff8e1";
							document.getElementById('a11').style.backgroundColor = "transparent";
							document.getElementById('a33').style.backgroundColor = "transparent";
							document.getElementById('price1').style.display = "block";
							document.getElementById('price2').style.display = "none";
							document.getElementById('p3').style.display = "none";
							document.getElementById('p2').style.display = "none";
							document.getElementById('ptab2').style.display = "none";
							document.getElementById('ptab1').style.display = "none";
							document.getElementById('ptab').style.display = "none";
							break;
						case 3:

							document.getElementById('a22').style.backgroundColor = "#303f9f";
							document.getElementById('a22').style.color = "#ffffff";
							document.getElementById('a11').style.color = "#fff8e1";
							document.getElementById('a33').style.color = "#fff8e1";
							document.getElementById('a11').style.backgroundColor = "transparent";
							document.getElementById('a33').style.backgroundColor = "transparent";
							document.getElementById('price1').style.display = "block";
							document.getElementById('price2').style.display = "none";
							document.getElementById('p3').style.display = "none";
							document.getElementById('p2').style.display = "none";
							document.getElementById('ptab2').style.display = "none";
							document.getElementById('ptab1').style.display = "none";
							document.getElementById('ptab').style.display = "none";
							break;
						default:
							break;
					}

				}
				//display end 

		}) //end kbordCtrl

})();