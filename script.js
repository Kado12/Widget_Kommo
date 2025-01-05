define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this,
      system = self.system(),
      langs = self.langs;

    this.callbacks = {

      settings: function () {
        return true;
      },

      init: function () {
        // * Load custom CSS
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = self.params.path + '/style.css'; // * Ensure the correct path to style.css
        document.head.appendChild(link);

        return true;
      },

      bind_actions: function () {
        return true;
      },

      render: function () {
        return true;
      },

      salesbotDesignerSettings: function ($modal_body, rowTemplate, params) {
        var widgetParams = params.params.params.params;
        console.log(widgetParams);

        var i18n_salesbot = self.i18n('salesbot');
        var i18n_settings = self.i18n('settings');

        var template = `
          <div class="widget-settings-block">

            <div class="widget-settings-block__item">
              <div class="widget-settings-block__title">${i18n_settings.msj_client}</div>
              <textarea class="widget-settings-block__input" name="msj_client" id:"msj_client" type="text" autocomplete="off">${widgetParams.msj_client || ''}</textarea>
            </div>

            <div class="widget-settings-block__item">
              <div class="widget-settings-block__title">${i18n_settings.thread_id}</div>
              <input type="text" class="widget-settings-block__input" name="thread_id" id="thread_id" value="${widgetParams.thread_id || ''}" autocomplete="off">
            </div>

            <div class="widget-settings-block__item">
              <div class="widget-settings-block__title">${i18n_settings.name_client}</div>
              <input type="text" class="widget-settings-block__input" name="name_client" id="name_client" value="${widgetParams.name_client || ''}" autocomplete="off">
            </div>

            <div class="widget-settings-block__item">
              <div class="widget-settings-block__title">${i18n_settings.lead_id}</div>
              <input type="text" class="widget-settings-block__input" name="lead_id" id="lead_id" value="${widgetParams.lead_id || ''}" autocomplete="off">
            </div>

          </div>
        `;

        $modal_body.html(template);

        return {
          exits: [
            { code: 'success', title: i18n_salesbot.success_callback_title },
            { code: 'fail', title: i18n_salesbot.fail_callback_title },
          ],
        };
      },

      onSalesbotDesignerSave: function (params) {
        console.log(`Params on save: ${params}`);

        return JSON.stringify([
          {
            question: [
              {
                "handler": "widget_request",
                "params": {
                  "url": "https://api.salesbot.com", // TODO: URL to send the request
                  "data": params
                }
              },
              {
                handler: 'goto',
                params: {
                  type: 'question',
                  step: 1,
                },
              },
            ],
          },
          {
            question: [
              {
                handler: 'conditions',
                params: {
                  logic: 'and',
                  conditions: [
                    {
                      term1: '{{json.status}}',
                      term2: 'success',
                      operation: '=',
                    },
                  ],
                  result: [
                    {
                      handler: 'exits',
                      params: {
                        value: 'success',
                      },
                    },
                  ],
                },
              },
              {
                handler: 'exits',
                params: {
                  value: 'fail',
                },
              },
            ],
          },
        ]);
      },

      onSave: function () {
        return true;
      }
    };

    return this;
  };

  return CustomWidget;
});