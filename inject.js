(function(window) {
  function num(n,cs) {
    if (!n) return cs[2];
    n = n % 100;
    if ((n % 10 == 0) || (n % 10 > 4) || (n > 4 && n < 21)) {
      return cs[2];
    } else
    if (n % 10 == 1) {
      return cs[0];
    } else {
      return cs[1];
    }
  }

  function fixUrl(url) {
    if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) url = 'http://' + url;
    return url;
  }

  var linksStopList = ['/friends', '/im', '/feed', '/video', '/audio', '/albums', '/photo', '/groups', /*'/group', '/public', '/event',*/ '/fave', '/apps', '/app', '/docs', '/dev', '/settings', '/search', '/wall', '/gifts', '/away', '/tag', '/support', '/about', '/terms', '/ads', '/jobs', 'http'];
  var linksRegex = /^\/([a-z0-9._]+)$/;
  var links = document.getElementsByTagName('a');
  var linksPaused = false;
  function updateLinks() {
    if (linksPaused) return;

    //console.time('processing links');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute('href');

      if (!href || linksStopList.indexOf(href) != -1) continue;
      if (!link.hasAttribute('vk_notes_tooltip')) {
        link.setAttribute('vk_notes_tooltip', true);
        if (href.indexOf('?') != -1) continue;
        var valid = true;
        for (var i = 0; i < linksStopList.length; i++) {
          if (href.indexOf(linksStopList[i]) == 0) {
            valid = false;
            break;
          }
        }
        if (!valid) continue;

        var match = href.match(linksRegex);
        var isGroup = false;
        if (href.indexOf('/group') > -1 || href.indexOf('/public') > -1 || href.indexOf('/event') > -1) {
          match = href.match(/^\/[a-z]+([0-9]+)$/);
          isGroup = true;
        }

        if (match) {
          (function(link, match, isGroup) {
            link.addEventListener('mouseover', function(e) {

              var to = setTimeout(function() {
                clearTimeout(to);
                to = false;

                stManager.add('md5.js', function() {
                  var query = ajx2q({
                    format: 'json',
                    api_id: 4273167,
                    access_token: window.vkNotesOptions.accessToken,
                    v: '5.16',
                    code:
                      (!isGroup? 'var self = API.users.get()[0]; var user = API.users.get({"user_ids": "' + match[1] + '", "fields": "photo_100,status,bdate,city,country,online,online_mobile,last_seen,lists,contacts,site,education"})[0];' +
                      'if (self.id == user.id) return false;' +
                      'if (user) { ' +
                      'var mutual = API.friends.getMutual({"target_uid": user.id});' +
                      'return {"user": user, "mutual": API.users.get({"user_ids": mutual, "fields": "photo_50"})};' +
                      '} else { ' : '') +
                      'var group = API.groups.getById({"group_ids": "' + match[1] + '", "fields": "status,activity,description,contacts,links,site,city,country"})[0];' +
                      'if (group) { ' +
                      'return {"group": group, "members": API.groups.getMembers({"group_id": group.id, "fields": "photo_50", "count": 50})};' +
                      '} else ' +
                      'return false;' +
                      (!isGroup ? '}' : '')
                  });
                  query += '&method=execute&oauth=1&sig=' + MD5('/method/?' + unescape(query) + window.vkNotesOptions.secret);

                  ajax.plainpost('/api.php', query, function(result) {
                    result = JSON.parse(result);
                    if (!result.response) return;
                    if (result.response.user) {
                      var user = result.response.user;
                      var bdate = (user.bdate || '').split('.');
                      var now = new Date();
                      var age = (bdate.length == 3) ? (
                        (now.getFullYear() - bdate[2] - 1) +
                        (now.getMonth() + 1 > bdate[1]) +
                        (now.getMonth() + 1 == bdate[1] && now.getDate() >= bdate[0])
                      ) : false;
                      var mutual = result.response.mutual;
                      var mutualArr = [];
                      if (mutual) {
                        for (var i = 0; i < Math.min(mutual.length, 12); i++) {
                          mutualArr.push(
                            //'<td class="mention_tt_person">' +
                              '<a class="mention_tt_person" style="display: inline-block; margin-bottom: 3px" href="/id' + mutual[i].id + '"' + /*' onmouseover="showTooltip(this, {text: &quot;' + mutual[i].first_name + ' ' + mutual[i].last_name + '&quot;, black: 1, shift: [3, 0, 0], showsp: 0});" vk_notes_tooltip="true"'*/'>' +
                              '<img src="' + mutual[i].photo_50 + '" width="32" height="32"></a>'// +
                            //'</td>'
                          );
                        }
                      }

                      chrome.runtime.sendMessage(window.vkNotesExtensionId, { method: 'getNote', user_id: user.id }, function(note) {
                        //linksPaused = true;
                        showTooltip(link, {
                          className: 'mention_tt',
                          content:
                            '<table class="mention_tt_t" style="width: 330px" cellpadding="0" cellspacing="0">' +
                              '<tbody><tr>' +
                              '<td class="mention_tt_photo"><a href="/' + match[1] + '" class="mention_tt_photo" vk_notes_tooltip="true"><img src="' + user.photo_100 + '" width="100"></a></td>' +
                            '<td>' +
                              '<div class="mention_tt_right" style="width: 216px">' +
                                '<h4 class="mention_tt_title" style="color: white; font-weight: normal"><a href="/' + match[1] + '" style="font-weight: bold" vk_notes_tooltip="true">' + user.first_name + ' ' + user.last_name + '</a>' + ((window.vkNotesOptions.showUserAge && age)? ', ' + age + num(age, [' год', ' года', ' лет']) : '') + '</h4>' +
                                ((window.vkNotesOptions.showUserStatus && user.status)? '<div class="mention_tt_info">' + user.status + '</div>' : '') +
                                '<div style="height: 7px"></div>' +
                                ((window.vkNotesOptions.showUserNote && note && note.visible)? '<div class="mention_tt_info"><span style="color: white; display: inline-block; width: 56px">Заметка:</span> ' + note.text + '</div>' : '') +
                                ((window.vkNotesOptions.showUserCity && user.city && user.country)? '<div class="mention_tt_info"><span style="color: white; display: inline-block; width: 56px">Город:</span> <a href="/search?c[name]=0&c[section]=people&c[country]=' + user.country.id + '&c[city]=' + user.city.id + '" title="' + user.city.title + ', ' + user.country.title + '">' + user.city.title + '</a></div>' : '') +
                                ((window.vkNotesOptions.showUserUniversity && user.university_name)? '<div class="mention_tt_info"><span style="color: white; display: inline-block; width: 56px">ВУЗ:</span> <a href="/search?c[name]=0&c[section]=people&c[university]=' + user.university + '">' + user.university_name + '</a></div>' : '') +
                                ((window.vkNotesOptions.showUserSite && user.site)? '<div class="mention_tt_info"><span style="color: white; display: inline-block; width: 56px">Сайт:</span> <a href="' + fixUrl(user.site) + '" target="_blank">' + user.site + '</a></div>' : '') +
                                ((window.vkNotesOptions.showUserPhone && user.mobile_phone)? '<div class="mention_tt_info"><span style="color: white; display: inline-block; width: 56px">Телефон:</span> <a href="tel:' + user.mobile_phone + '">' + user.mobile_phone + '</a></div>' : '') +
                                '<div class="mention_tt_people_wrap">' +
                                ((window.vkNotesOptions.showUserMutual && mutual)? 
                                '<div class="mention_tt_people_title"><a href="friends?id=' + user.id + '&section=common" vk_notes_tooltip="true">' + (mutual.length || 'нет') + ' ' + num(mutual.length, ['общий друг', 'общих друга', 'общих друзей']) + '</a></div>' +
                                /*'<table class="mention_tt_people" cellspacing="0" cellpadding="0"><tbody><tr>' +
                                  mutualArr.join('') +
                                '</tr></tbody></table>'*/
                                '<div style="margin-top: 5px">' + mutualArr.join('') + '</div>'
                                : '') +
                                '</div>' +
                              '</div>' +        
                            '</td></tr></tbody></table>', 
                          //black: 1,
                          shift: [54, 8, 8],
                          hidedt: 500,
                          slide: 15
                        });
                        //linksPaused = false;
                      });
                    } else
                    if (result.response.group) {
                      var group = result.response.group;
                      var members = result.response.members;
                      var membersArr = [];
                      if (members) {
                        for (var i = 0; i < Math.min(members.items.length, 12); i++) {
                          membersArr.push(
                            //'<td class="mention_tt_person">' +
                              '<a class="mention_tt_person" style="display: inline-block; margin-bottom: 3px" href="/id' + members.items[i].id + '"' + /*' onmouseover="showTooltip(this, {text: &quot;' + members[i].first_name + ' ' + members[i].last_name + '&quot;, black: 1, shift: [3, 0, 0], showsp: 0});" vk_notes_tooltip="true"'*/'>' +
                              '<img src="' + members.items[i].photo_50 + '" width="32" height="32"></a>'// +
                            //'</td>'
                          );
                        }
                      }

                      showTooltip(link, {
                        className: 'mention_tt',
                        content:
                          '<table class="mention_tt_t" style="width: 330px" cellpadding="0" cellspacing="0">' +
                            '<tbody><tr>' +
                            '<td class="mention_tt_photo"><a href="/' + match[1] + '" class="mention_tt_photo" vk_notes_tooltip="true"><img src="' + group.photo_100 + '" width="100"></a></td>' +
                          '<td>' +
                            '<div class="mention_tt_right" style="width: 216px">' +
                              '<h4 class="mention_tt_title" style="color: white; font-weight: normal"><a href="/' + match[1] + '" style="font-weight: bold" vk_notes_tooltip="true">' + group.name + '</a></h4>' +
                              ((window.vkNotesOptions.showGroupActivity && group.activity)? '<div class="mention_tt_info">' + group.activity + '</div>' : '') +
                              ((window.vkNotesOptions.showGroupStatus && group.status)? '<div class="mention_tt_info">' + group.status + '</div>' : '') +
                              '<div style="height: 7px"></div>' +
                              ((window.vkNotesOptions.showGroupDescription && group.description)? '<div class="mention_tt_info" style="overflow: hidden; max-height: 70px">' + group.description + '</div>' : '') +
                              ((window.vkNotesOptions.showGroupCity && group.city && group.country)? '<div class="mention_tt_info"><span style="color: white; display: inline-block; width: 56px">Город:</span> <a href="/search?c[name]=0&c[section]=communities&c[country]=' + group.country.id + '&c[city]=' + group.city.id + '" title="' + group.city.title + ', ' + group.country.title + '">' + group.city.title + '</a></div>' : '') +
                              ((window.vkNotesOptions.showGroupSite && group.site)? '<div class="mention_tt_info"><span style="color: white; display: inline-block; width: 56px">Сайт:</span> <a href="' + fixUrl(group.site) + '" target="_blank">' + group.site + '</a></div>' : '') +
                              '<div class="mention_tt_people_wrap">' +
                              ((window.vkNotesOptions.showGroupMembers && members && members.count)? 
                              '<div class="mention_tt_people_title"><a href="/search?c%5Bgroup%5D=' + group.id + '&c%5Bsection%5D=people" vk_notes_tooltip="true">' + (members.count || 'нет') + ' ' + num(members.count, ['участник', 'участника', 'участников']) + '</a></div>' +
                              /*'<table class="mention_tt_people" cellspacing="0" cellpadding="0"><tbody><tr>' +
                                mutualArr.join('') +
                              '</tr></tbody></table>'*/
                              '<div style="margin-top: 5px">' + membersArr.join('') + '</div>'
                              : '') +
                              '</div>' +
                            '</div>' +        
                          '</td></tr></tbody></table>', 
                        //black: 1,
                        shift: [54, 8, 8],
                        hidedt: 500,
                        slide: 15
                      });
                      //linksPaused = false;
                    }
                  });
                });
              }, 700);

              link.addEventListener('mouseout', function(e) {
                if (to) {
                  clearTimeout(to);
                  to = false;
                }
              });
            });
          })(link, match, isGroup);
        }
      }
    }
    //console.timeEnd('processing links');
  }

  window.addEventListener('message', function(event) {
    if (event.source != window)
      return;

    if (event.data.type && (event.data.type == 'VK_NOTES_UPDATE_LINKS')) {
      updateLinks();
    }
  }, false);
  updateLinks();

  window.mentionOver = function() {}; // stub
})(window);