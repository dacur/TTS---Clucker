require 'json'
require 'cluckdata.rb'

class ApiController < ApplicationController
	def savesignup
		first = params[:first]
		last = params[:last]
		email = params[:email]
		password = params[:password]

		p '1 : ' + first + ' | ' + last + ' | ' + email + ' | ' + password

		u = User.new(first: first, last: last, email: email, password: password) 

		if (u.valid?)
			u.save
			render json: u
		else
			render json: nil
		end
	end

	def login
		email = params[:email]
		password = params[:password]

		p email + ' | ' + password

		u = User.find_by(email: email)

		if (u != nil && u.password == password)
			user_id = u.id.to_s
			render json: user_id.to_json
		else
			render json: nil
		end
	end

	def savecluck
		user_id = params[:userID]
		text = params[:text].chomp

		p user_id + ' | ' + text

		u = User.find(user_id)

		post_date = Time.now
		p post_date
		post_date.to_formatted_s(:short)         
		p post_date
		
		cd = CluckData.new(nil, user_id, u.first + ' ' + u.last, text, post_date)
		cd.save

		render json: cd
	end
end
